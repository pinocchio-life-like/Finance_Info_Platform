import PropTypes from "prop-types";
import MainContent from "./WikiContent/MainContent";

const WikiHome = (props) => {
  return (
    <div className="flex flex-col h-screen">
      <header className="min-h-[90px] bg-blue-500">Header</header>
      <MainContent>{props.children}</MainContent>
    </div>
  );
};

WikiHome.propTypes = {
  children: PropTypes.node,
};

export default WikiHome;
