import App from 'app';
import ListingsRoute from 'routes/listings.route';
import UsersRoute from 'routes/users.route';
import AuthRoute from 'routes/auth.route';
import CategoryRoute from './routes/category.route';

const app = new App([new ListingsRoute(), new UsersRoute(), new AuthRoute(), new CategoryRoute()]);

app.connectToDatabase();
app.listen();
