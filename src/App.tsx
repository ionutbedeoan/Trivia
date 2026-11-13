import { Layout } from './components/Layout';
import { NavigationProvider, useNavigation } from './components/Navigation';
import { AppProvider } from './services/AppContext';
import { CreateRoom, Home, JoinRoom, Lobby } from './pages/Rooms';
import { Game, Result } from './pages/Game';
import { AccountForm, Profile, Settings } from './pages/Account';
import { About, ErrorPage, Privacy, Rules } from './pages/Information';
import { QuestionEditor, QuestionList } from './pages/Editorial';

function Routes() {
  const { path } = useNavigation();
  let page;
  if (path === '/') page = <Home />;
  else if (path === '/creeaza') page = <CreateRoom />;
  else if (path === '/intra') page = <JoinRoom />;
  else if (/^\/camera\/[^/]+$/.test(path)) page = <Lobby />;
  else if (/^\/joc\/[^/]+$/.test(path)) page = <Game />;
  else if (/^\/rezultat\/[^/]+$/.test(path)) page = <Result />;
  else if (path === '/cont/conectare') page = <AccountForm key={path} mode="login" />;
  else if (path === '/cont/creare') page = <AccountForm key={path} mode="create" />;
  else if (path === '/cont/recuperare') page = <AccountForm key={path} mode="recover" />;
  else if (path === '/profil') page = <Profile />;
  else if (path === '/setari') page = <Settings />;
  else if (path === '/cum-se-joaca') page = <Rules />;
  else if (path === '/despre-si-surse') page = <About />;
  else if (path === '/confidentialitate') page = <Privacy />;
  else if (path === '/admin/intrebari') page = <QuestionList />;
  else if (/^\/admin\/intrebari\/[^/]+$/.test(path)) page = <QuestionEditor key={path} />;
  else page = <ErrorPage code={path.startsWith('/eroare/') ? path.split('/').at(-1) : '404'} />;
  return <Layout>{page}</Layout>;
}
export function App() {
  return (
    <NavigationProvider>
      <AppProvider>
        <Routes />
      </AppProvider>
    </NavigationProvider>
  );
}
