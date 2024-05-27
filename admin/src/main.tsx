import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './redux/store.ts';
import { Provider } from 'react-redux';
import './css/style.css';
import './css/satoshi.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>,
)
