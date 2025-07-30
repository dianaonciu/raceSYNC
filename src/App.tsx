import Header from './components/Header/Header';
import './App.module.scss';
import { dropdownMocks } from './mockups/mockData';
import Taskbar from './components/Taskbar/Taskbar';
import MainView from './components/MainView/MainView';

const App = () => {
  return (
    <div className="appContainer">
      <Header />
      <Taskbar dropdowns={dropdownMocks} />
      <MainView />
    </div>
  );
};

export default App;
