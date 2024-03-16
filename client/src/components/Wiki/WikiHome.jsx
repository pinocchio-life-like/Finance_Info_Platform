import PropTypes from "prop-types";
import MainContent from "./WikiContent/MainContent";

const WikiHome = (props) => {
  return (
    <div className="flex flex-col h-screen">
      <MainContent>{props.children}</MainContent>
    </div>
  );
};

WikiHome.propTypes = {
  children: PropTypes.node,
};

export default WikiHome;
