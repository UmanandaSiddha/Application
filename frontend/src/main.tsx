import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import { store } from './store/store.ts';
// import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Provider store={store}>
				{/* <HelmetProvider> */}
					<App />
				{/* </HelmetProvider> */}
			</Provider>
		</BrowserRouter>
	</StrictMode>,
)