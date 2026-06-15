import { Outlet } from "react-router";
import { Container, Footer, Header } from "./components";

function App() {
  return (
    <Container>
      <Header />
      <main className="min-h-[55vh] w-full block">
        <Outlet />
      </main>
      <Footer />
    </Container>
  );
}

export default App;
