// import React from 'react';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faVideo} from "@fortawesome/free-solid-svg-icons";
//
// function InvestingForensicManage() {
//
//     return (
//         <>
//             <div className="row">
//                     {/* Card 1 (Clickable) */}
//
//                     <div className="col-12 col-md-6 col-lg-3 mb-4"
//                          onClick={() => {
//                              window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/admin/investingforensic/dashboard`;
//                          }}
//                     >
//                         <div className="card card-custom-vfs gutter-b"
//                              style={{height: "150px", textDecoration: "none", cursor: "pointer"}}>
//                             <div className="card-body-vfs">
//                                 <FontAwesomeIcon icon={faVideo} style={{color: '#2d8a9e', fontSize: '48px'}}/>
//                                 <div className="lead font-weight-bold mt-4">
//                                     Investigation Forensics
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//
//                     {/*/!* Card 2 (Non-clickable, no pointer cursor) *!/*/}
//                     {/*<div className="col-12 col-md-6 col-lg-3 mb-4"*/}
//                     {/*     onClick={() => {*/}
//                     {/*         window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/admin/crowd/dashboard`;*/}
//                     {/*     }}*/}
//                     {/*>*/}
//                     {/*    <div className="card card-custom-vfs gutter-b"*/}
//                     {/*         style={{height: "150px", textDecoration: "none", cursor: "pointer"}}>*/}
//                     {/*        <div className="card-body-vfs">*/}
//                     {/*            <FontAwesomeIcon icon={faPersonFalling} style={{color: '#2d8a9e', fontSize: '48px'}}/>*/}
//                     {/*            <div className="lead font-weight-bold mt-4">*/}
//                     {/*                Crowd Monitoring*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//
//                     {/*/!* Card 3 (Non-clickable, no pointer cursor) *!/*/}
//                     {/*<div className="col-12 col-md-6 col-lg-3 mb-4"*/}
//                     {/*     onClick={() => {*/}
//                     {/*         window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/admin/occupancy/dashboard`;*/}
//                     {/*     }}*/}
//                     {/*>*/}
//                     {/*    <div className="card card-custom-vfs gutter-b"*/}
//                     {/*         style={{height: "150px", textDecoration: "none", cursor: "pointer"}}>*/}
//                     {/*        <div className="card-body-vfs">*/}
//                     {/*            <Videocam style={{fontSize: '50px', color: '#2d8a9e'}}/>*/}
//                     {/*            <div className="lead font-weight-bold mt-4">*/}
//                     {/*                Occupancy Analysis*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//
//                     {/*/!* Card 4 (Non-clickable, no pointer cursor) *!/*/}
//                     {/*<div className="col-12 col-md-6 col-lg-3 mb-4"*/}
//                     {/*     onClick={() => {*/}
//                     {/*         window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#/admin/objectleftbehind/dashboard`;*/}
//                     {/*     }}*/}
//                     {/*>*/}
//                     {/*    <div className="card card-custom-vfs gutter-b"*/}
//                     {/*         style={{height: "150px", textDecoration: "none", cursor: "pointer"}}>*/}
//                     {/*        <div className="card-body-vfs">*/}
//                     {/*            <FontAwesomeIcon icon={faUserSecret} style={{color: '#2d8a9e', fontSize: '48px'}}/>*/}
//                     {/*            <div className="lead font-weight-bold mt-4">*/}
//                     {/*                Abandoned Object*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//
//                 </div>
//         </>
//     );
// }
//
// export default InvestingForensicManage;
