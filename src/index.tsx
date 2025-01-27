import ReactDOM from 'react-dom/client';
import './assets/scss/style.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from 'context/AuthContext';
import { RecoilRoot } from 'recoil';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
	<RecoilRoot>
		<AuthContextProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthContextProvider>
	</RecoilRoot>
	
);
