import zhihu from "../../../assets/Svgs/zhihu-svgrepo-com.svg";

const QandACommon = () => {
  return (
    <div className="flex-grow flex flex-col items-center bg-white">
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 relative pt-4 pb-2">
        <div className="flex justify-start items-center">
          <img className="w-10 h-10" src={zhihu} alt="My Icon" />{" "}
          <h1 className="ml-3 text-3xl font-bold">知乎</h1>{" "}
        </div>
      </div>
      <div className="flex justify-start items-center w-3/5 border-r border-gray-600 relative pt-4 pb-2">
        <div>hello</div>
        <div>hello</div>
      </div>
    </div>
  );
};

export default QandACommon;
