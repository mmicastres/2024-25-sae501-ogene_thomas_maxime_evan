import Home from "./pages/HomeScreen"
import Calendar from "./pages/CalendarScreen"
import { IaProvider } from "./context/Ia";

function App() {
  return (
    <IaProvider>
      <Calendar/>
      <Home/>
    </IaProvider>
  );
}

export default App;
