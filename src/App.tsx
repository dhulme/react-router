import React from "react";
import "./App.css";
import {
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { getUrl, useNavigate, useLink, Page, useParams } from './routing'

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to={Page.Home}>Home</Link>
          </li>
          <li>
            <Link to={Page.About}>About</Link>
          </li>
          <li>
            <Link to={Page.Groups}>Groups</Link>
          </li>
          <li>
            <Link to={Page.Users}>Users</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path={Page.About}>
          <div>About</div>
        </Route>
        <Route path={Page.Groups}>
          <div>Groups</div>
        </Route>
        <Route path={Page.Users} element={<Users />} />
        <Route path={Page.UserGroups}>
          <h3>User groups</h3>
        </Route>
        <Route path={Page.User} element={<User />} />
        <Route path={Page.Home}>
          <div>Home</div>
        </Route>
      </Routes>
    </div>
  );
}

function Users() {
  return (
    <div>
      <h2>Users</h2>
      <h3>Please select a user.</h3>
      <Link to={getUrl(Page.User, { userId: 1 })}>User 1</Link>
    </div>
  );
}

function User() {
  const { userId, details } = useParams(Page.User);
  const navigate = useNavigate();
  const link = useLink();

  if (!userId) return null;
  return (
    <div>
      <p>User id: {userId}</p>
      <div>
        <Link to={link(Page.User, { userId: userId + 1 })}>Next user</Link>
        {details && <div>Some user details</div>}
        <div><button onClick={() => navigate(Page.User, { userId, details: !details })}>{details ? 'Hide' : 'Show'} details</button></div>
        <div><button onClick={() => navigate(Page.User, { userId: 3, details })}>User 3 keep details</button></div>
        <Link to={link(Page.UserGroups, { userId })}>Groups</Link>
      </div>
    </div>
  );
}

export default App;
