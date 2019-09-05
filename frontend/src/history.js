import { createBrowserHistory } from 'history';

// https://stackoverflow.com/questions/47580538/react-router-v4-basename-and-custom-history
export default createBrowserHistory({ basename: process.env.PUBLIC_URL });
