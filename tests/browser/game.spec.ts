import { test, expect } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';
import { Storage } from '../../server/storage';
const root = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3100';
async function waitForConnection(page: Page) {
  await expect(page.getByText('Se conectează la server…')).toHaveCount(0);
}

test('fără conturi: preferințe locale persistente și rute vechi indisponibile', async ({
  page,
}) => {
  await page.goto(root + '/setari');
  await waitForConnection(page);
  await expect(
    page.locator('a[href^="/cont/"], a[href="/profil"], a[href^="/admin/"]'),
  ).toHaveCount(0);
  await page.getByLabel('Pseudonim implicit').fill('TestInvitat');
  await page.getByLabel('Sunet la începutul întrebării').check();
  await page.getByRole('radio', { name: 'Activată', exact: true }).check();
  await page.getByRole('button', { name: 'Salvează modificările' }).click();
  await page.reload();
  await waitForConnection(page);
  await expect(page.getByLabel('Pseudonim implicit')).toHaveValue('TestInvitat');
  await expect(page.getByLabel('Sunet la începutul întrebării')).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Activată', exact: true })).toBeChecked();
  await page.goto(root + '/creeaza');
  await waitForConnection(page);
  await expect(page.getByLabel('Pseudonim', { exact: true })).toHaveValue('TestInvitat');
  for (const route of [
    '/cont/conectare',
    '/cont/creare',
    '/cont/recuperare',
    '/profil',
    '/admin/intrebari',
  ]) {
    await page.goto(root + route);
    await waitForConnection(page);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    await expect(page.locator('main')).toContainText('404');
  }
});
test('12 răspunsuri greșite afișează -600 în joc, rezultat și după reîncărcare', async ({
  page,
}) => {
  const storage = new Storage(':memory:');
  const bank = storage.questions();
  storage.db.close();
  await page.goto(root + '/creeaza?singur=1');
  await waitForConnection(page);
  await page.getByLabel('Pseudonim', { exact: true }).fill('Scor Negativ');
  await page.getByRole('button', { name: 'Creează camera', exact: true }).click();
  await page.getByLabel('Sunt pregătit', { exact: true }).check();
  await page.getByRole('button', { name: 'Începe partida' }).click();
  await expect(page.getByText('Scor minim 0', { exact: false })).toHaveCount(0);
  await page.getByRole('button', { name: 'Sunt gata', exact: true }).click();
  for (let index = 0; index < 12; index++) {
    await expect(page.locator('.game-meta')).toContainText(`Întrebarea ${index + 1}/12`);
    const text = await page.locator('.question-card h1').textContent();
    const question = bank.find((q) => q.text === text);
    expect(question).toBeTruthy();
    const options = await page.locator('.answer strong').allTextContents();
    const wrong = options.findIndex((option) => option !== question!.options[question!.correct]);
    expect(wrong).toBeGreaterThanOrEqual(0);
    await page.getByRole('radio').nth(wrong).check();
    await page.getByRole('button', { name: 'Trimite răspunsul', exact: true }).click();
    await expect(page.locator('.result-badge')).toContainText('Greșit -50');
    await expect(page.locator('.score-sidebar')).toContainText(String(-50 * (index + 1)));
    await page.getByRole('button', { name: 'Am citit', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Scorul tău -600', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Scorul tău -600', exact: true })).toBeVisible();
  await expect(page.locator('.recap details')).toHaveCount(12);
});
test('invitație de pe calculator: telefon prin IP LAN, intrare și pregătire pe HTTP', async ({
  browser,
}) => {
  const hostContext = await browser.newContext();
  const guestContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const host = await hostContext.newPage();
    await host.goto(root + '/creeaza');
    await waitForConnection(host);
    const session = await host.evaluate(async () => (await fetch('/api/session')).json());
    test.skip(session.invitationOrigin === new URL(root).origin, 'Nu există adresă LAN distinctă.');
    await host.getByLabel('Pseudonim', { exact: true }).fill('Andrei');
    await host.getByRole('button', { name: 'Creează camera', exact: true }).click();
    const code = await host.getByTestId('room-code').textContent();
    // Capture the same URL used by the copy button, without touching the OS clipboard.
    await host.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value: string) => {
            document.documentElement.dataset.invitation = value;
          },
        },
      });
    });
    await host.getByRole('button', { name: 'Copiază linkul' }).click();
    const invitation = await host.locator('html').getAttribute('data-invitation');
    expect(invitation).toBe(`${session.invitationOrigin}/intra?cod=${code}`);
    const guest = await guestContext.newPage();
    const errors: string[] = [];
    guest.on('pageerror', (error) => errors.push(error.message));
    await guest.goto(invitation!);
    await waitForConnection(guest);
    expect(await guest.evaluate(() => window.isSecureContext)).toBe(false);
    await guest.getByLabel('Pseudonim', { exact: true }).fill('Elena');
    await guest.getByRole('button', { name: 'Intră', exact: true }).click();
    await expect(guest.getByTestId('room-code')).toHaveText(code!);
    await guest.getByLabel('Sunt pregătit', { exact: true }).check();
    await expect(host.getByRole('status').filter({ hasText: 'sunt pregătiți.' })).toHaveText(
      '1 din 2 sunt pregătiți.',
    );
    expect(errors).toEqual([]);
  } finally {
    await hostContext.close();
    await guestContext.close();
  }
});
for (const capacity of [1, 2, 4])
  test(`${capacity} browsere: lobby → 12 întrebări → rezultat → revanșă`, async ({ browser }) => {
    const contexts: BrowserContext[] = [],
      pages: Page[] = [],
      errors: string[] = [];
    for (let i = 0; i < capacity; i++) {
      const context = await browser.newContext({
        viewport: i % 2 ? { width: 390, height: 844 } : { width: 1440, height: 900 },
      });
      contexts.push(context);
      const page = await context.newPage();
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('dialog', (d) => d.accept());
      pages.push(page);
    }
    try {
      const host = pages[0];
      await host.goto(capacity === 1 ? root + '/' : `${root}/creeaza`);
      if (capacity === 1)
        await host.getByRole('link', { name: 'Joacă singur', exact: true }).click();
      await waitForConnection(host);
      await host.getByLabel('Pseudonim', { exact: true }).fill('Andrei');
      await host
        .getByRole('radio', {
          name: capacity === 1 ? 'Singur' : String(capacity),
          exact: true,
        })
        .check();
      if (capacity === 4) await host.getByRole('radio', { name: 'Dificil', exact: true }).check();
      await expect(host.getByRole('group', { name: 'Timp de răspuns' })).toHaveCount(0);
      await host.getByRole('button', { name: 'Creează camera', exact: true }).click();
      const code = await host.getByTestId('room-code').textContent();
      for (let i = 1; i < capacity; i++) {
        await pages[i].goto(`${root}/intra?cod=${code}`);
        await waitForConnection(pages[i]);
        await pages[i]
          .getByLabel('Pseudonim', { exact: true })
          .fill(['Elena', 'Radu', 'Ioana'][i - 1]);
        await pages[i].getByRole('button', { name: 'Intră', exact: true }).click();
        await expect(pages[i].getByTestId('room-code')).toHaveText(code!);
      }
      for (const page of pages) await page.getByLabel('Sunt pregătit', { exact: true }).check();
      await host.getByRole('button', { name: 'Începe partida' }).click();
      const questions = new Set<string>();
      for (let index = 0; index < 12; index++) {
        if (index === 0)
          for (const page of pages)
            await page.getByRole('button', { name: 'Sunt gata', exact: true }).click();
        for (const page of pages)
          await expect(page.locator('.game-meta')).toContainText(`Întrebarea ${index + 1}/12`);
        for (const page of pages) {
          await expect(page.getByRole('button', { name: 'Sunt gata', exact: true })).toHaveCount(0);
          await expect(page.locator('.inline-feedback')).toHaveCount(0);
          await expect(page.getByText('Mizează · o utilizare')).toHaveCount(0);
          await expect(page.getByRole('button', { name: 'Mai am nevoie de timp' })).toHaveCount(0);
          if (index === 0 && page.viewportSize()!.width < 768) {
            const scores = await page.locator('.score-sidebar').boundingBox();
            const question = await page.locator('.question-card').boundingBox();
            expect(scores!.y + scores!.height).toBeLessThanOrEqual(question!.y);
            expect(scores!.width).toBeLessThanOrEqual(290);
            await page.screenshot({ path: 'artifacts/question-mobile.png', fullPage: true });
          }
        }
        const questionCards = await Promise.all(
          pages.map((page) => page.locator('.question-card').elementHandle()),
        );
        const text = await host.locator('.question-card h1').textContent();
        expect(questions.has(text!)).toBeFalsy();
        questions.add(text!);
        if (index === 0)
          await host.screenshot({ path: `artifacts/game-${capacity}-desktop.png`, fullPage: true });
        for (const [i, page] of pages.entries()) {
          await page
            .getByRole('radio')
            .nth(i % 4)
            .check();
          await page.getByRole('button', { name: 'Trimite răspunsul', exact: true }).click();
          if (index === 1 && i === 0 && capacity === 2) {
            await page.reload();
            await expect(
              page.getByText('Răspuns înregistrat. Așteptăm ceilalți jucători.'),
            ).toBeVisible();
            await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 15000 });
            await expect(
              page.getByRole('button', { name: 'Trimite răspunsul', exact: true }),
            ).toBeDisabled();
            // This reload is intentional; compare the refreshed card with its
            // subsequent inline feedback, rather than a handle from the old document.
            questionCards[i] = await page.locator('.question-card').elementHandle();
          }
        }
        for (const [i, page] of pages.entries()) {
          await expect(
            page.getByRole('heading', { name: 'Rezultatul tău', exact: true }),
          ).toBeVisible();
          expect(await questionCards[i]!.evaluate((node) => node.isConnected)).toBeTruthy();
          await expect(page.locator('.question-card h1')).toHaveText(text!);
          await expect(page.locator('.question-card .answer')).toHaveCount(4);
          await expect(page.locator('.question-card .feedback-reference a')).toHaveAttribute(
            'href',
            /^https:/,
          );
          await expect(page.locator('.answer.correct')).toHaveCount(1);
        }
        if (index === 0 && capacity === 2) {
          await pages[1].reload();
          await expect(
            pages[1].getByRole('heading', { name: 'Rezultatul tău', exact: true }),
          ).toBeVisible();
          await expect(pages[1].getByRole('dialog')).toHaveCount(0, { timeout: 15000 });
          await pages[1].screenshot({ path: 'artifacts/explanation-mobile.png', fullPage: true });
        }
        for (const page of pages)
          await page.getByRole('button', { name: 'Am citit', exact: true }).click();
      }
      for (const page of pages) {
        await expect(page).toHaveURL(/\/rezultat\//);
        if (capacity === 1)
          await expect(page.getByRole('heading', { name: 'Partidă încheiată!' })).toBeVisible();
        await expect(page.locator('.recap details')).toHaveCount(12);
        await expect(page.getByRole('button', { name: 'Revanșă', exact: true })).toBeVisible();
      }
      await host.screenshot({ path: `artifacts/result-${capacity}.png`, fullPage: true });
      for (const page of pages)
        await page.getByRole('button', { name: 'Revanșă', exact: true }).click();
      for (const page of pages) {
        await expect(page).toHaveURL(/\/camera\//);
        await expect(page.getByLabel('Sunt pregătit', { exact: true })).not.toBeChecked();
      }
      for (const page of pages) await page.getByLabel('Sunt pregătit', { exact: true }).check();
      await host.getByRole('button', { name: 'Începe partida' }).click();
      for (const page of pages)
        await expect(page.getByRole('button', { name: 'Sunt gata', exact: true })).toBeVisible();
      expect(errors).toEqual([]);
    } finally {
      for (const context of contexts) await context.close();
    }
  });
test('responsive, meniu, rute și lipsa erorilor JavaScript', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/creeaza',
      '/intra',
      '/cum-se-joaca',
      '/despre-si-surse',
      '/confidentialitate',
      '/setari',
      '/nu-exista',
    ]) {
      await page.goto(root + route);
      await waitForConnection(page);
      await expect(page.locator('main h1').first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `${route} la ${width}px`,
      ).toBeTruthy();
    }
    await page.goto(root + '/');
    await waitForConnection(page);
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true });
  }
  await page.getByRole('button', { name: 'Meniu', exact: true }).click();
  await expect(page.locator('#main-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#main-nav')).not.toBeVisible();
  expect(errors).toEqual([]);
});
