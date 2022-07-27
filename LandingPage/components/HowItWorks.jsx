import React from "react";

import { FaSearch } from "react-icons/fa";

export default function HowItWorks(props) {
  return (
    <div className="start-today flex gap-12 px-16 mt-16 pb-12">
      <div className="w-1/2 sm:hidden">
        <img
          src="img/steps.svg"
          style={{ boxShadow: "none" }}
          className="mt-10"
          alt=""
        />
      </div>
      <div className="w-1/2 sm:w-full">
        <div className="about-text ">
          <h2 className="text-4xl font-bold prose sm:flex sm:justify-center sm:text-2xl">
            START TODAY
          </h2>

          {/* <p>{props.data ? props.data.paragraph : "loading..."}</p> */}
          <h3 className="text-2xl font-medium mb-8 sm:text-xl">
            As Easy As 1-2-3?
          </h3>
          <div className="list-style">
            {props.data
              ? props.data.Why.map((d, i) => (
                  <div className="mb-8">
                    <div className="flex  items-center mb-6">
                      <div
                        className="text-white rounded-full w-[40px] h-[40px]
                      flex items-center justify-center mr-[16px]
                      sm:w-[30px] sm:h-[30px]
                      "
                        style={{
                          background:
                            "linear-gradient(to right, #38B2AC 0%, #5ca9fb 100%)",
                        }}
                      >
                        <FaSearch />
                      </div>
                      <h4 className="font-medium text-lg sm:text-base">{d}</h4>
                    </div>
                    <hr
                      className=""
                      style={{
                        width: "100%",
                        background: "#beced4",
                        height: "1.5px",
                      }}
                    />
                  </div>
                ))
              : "loading"}
          </div>
        </div>
      </div>
    </div>
  );

  //   return (

  //     <div id="start prose">
  // <div className="container">
  //   <div className="row">
  //     <div style={{ padding: "16px" }} className="col-xs-12 col-md-6">
  //       <img
  //         src="img/steps.svg"
  //         style={{ boxShadow: "none" }}
  //         className="img-responsive"
  //         alt=""
  //       />{" "}
  //     </div>
  //     <div className="col-xs-12 col-md-6">
  //       <div className="about-text">
  //         <h2>Start Today</h2>

  //         {/* <p>{props.data ? props.data.paragraph : "loading..."}</p> */}
  //         <h3>As Easy As 1-2-3?</h3>
  //         <div className="list-style">
  //           <div className="col-lg-12 col-sm-12 col-xs-12">
  //             <ul>
  //               {props.data
  //                 ? props.data.Why.map((d, i) => (
  //                     <div>
  //                       <div style={{ display: "flex" }}>
  //                         <div
  //                           style={{
  //                             background:
  //                               "linear-gradient(to right, #38B2AC 0%, #5ca9fb 100%)",
  //                             color: "white",
  //                             borderRadius: "50%",
  //                             width: "40px",
  //                             height: "40px",
  //                             display: "flex",
  //                             alignItems: "center",
  //                             justifyContent: "center",
  //                             marginRight: "16px",
  //                           }}
  //                         >
  //                           <i className={"fa fa-search"}></i>
  //                         </div>
  //                         <h4>{d}</h4>
  //                       </div>
  //                       <hr
  //                         style={{ width: "100%", background: "#beced4" }}
  //                       />
  //                     </div>
  //                   ))
  //                 : "loading"}
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // </div>
  // </div>
  //   )
}
