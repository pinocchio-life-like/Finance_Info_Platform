import { Input, Timeline } from "antd";
import { useState } from "react";
const { Search } = Input;
import "./NoticeCommon.css";
const NoticeCommon = (props) => {
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 });

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
  };
  const [searchValue, setSearchValue] = useState("");
  return (
    <div>
      <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
        <div className="flex justify-between items-center w-full border-b border-gray-600 pb-1 pt-3">
          <div>
            {["Notices", "Company", "Create Notice"].map((link, index) => {
              return (
                <a
                  key={index}
                  className={`lg:p-2 px-1 py-2 cursor-pointer ${
                    activeLink.left === index
                      ? "border-b-2 border-black font-bold"
                      : ""
                  }`}
                  style={{ lineHeight: "2rem" }}
                  onClick={() => handleLink("left", index)}>
                  {link}
                </a>
              );
            })}
          </div>
          <div className="flex-grow max-w-lg">
            <Search
              placeholder="input search text"
              // onSearch={onSearch}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{}}
            />
          </div>
        </div>
        <div className="timeline_container w-full">
          <Timeline
            className="w-full mt-5"
            mode="left"
            items={[
              {
                label: "2015-09-01",
                color: "red",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "green",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "blue",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "cyan",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "purple",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "indigo",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
              {
                label: "2015-09-01",
                color: "red",
                children: (
                  <div
                    className="w-full rounded p-2 border border-gray-400"
                    style={{
                      position: "relative",
                      background: "",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        right: "100%",
                        top: "5%",
                        width: "0",
                        height: "0",
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid #00224D",
                      }}></div>
                    <div className="w-full flex-row">
                      <div className="w-full flex border-b pb-1 border-gray-400">
                        hello
                      </div>
                      <div className="w-full">
                        Blum auto bot free download for windows / blum auto farm
                        bot Hi everyone today we present you our bot for crypto
                        game Blum with which you can automate the whole process
                        in the game which is possible blum farm bot / blum auto
                        farm / blum python bot / free farm blum / blum telegram
                        auto bot / blum tg bot / blum auto bot free
                      </div>
                      <div>hello</div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default NoticeCommon;
