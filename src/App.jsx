import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import AuthProvider from "./providers/AuthProvider";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
