import PropTypes from "prop-types";
import QandACommon from "./QandACommon/QandACommon";

const QandAHome = (props) => {
  return (
    <div className="flex flex-col h-screen">
      <QandACommon>{props.children}</QandACommon>
    </div>
  );
};

QandAHome.propTypes = {
  children: PropTypes.node,
};

export default QandAHome;
