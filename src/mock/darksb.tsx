// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaChevronDown, FaChevronRight, FaSignOutAlt } from "react-icons/fa";
// import { APP_NAME } from "../../../../constant/BASE_URL";
// import Text from "../../../../components/Text";
// import { links } from "../utils/navLinks";
// import { APP_ROUTES } from "../../../../constant/APP_ROUTES";
// import ModalContainer from "../../../../components/modal/ModalContainer";
// import Button from "../../../../components/buttons/Button";
// import { updateUserData } from "../../../../redux/features/authSlice";
// import { useDispatch } from "react-redux";
// import { useAuth } from "../../../../hooks/useAuth";
// import { useLogoutMutation } from "../../../../redux/features/authApi";

// interface LeftSidebarProps {
//   toggleSidebar: () => void;
//   isCollapsed: boolean;
// }

// const LeftSidebar: React.FC<LeftSidebarProps> = ({ toggleSidebar, isCollapsed }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
//   const dispatch = useDispatch();
//   const { userData } = useAuth();
//   const [logout, { isLoading }] = useLogoutMutation();

//   const role = userData?.userData?.role || "SUPER_ADMIN";
//   const filteredLinks = links.filter((link) => link.roles.includes(role));

//   const handleLogout = async () => {
//     try {
//       await logout({}).unwrap();
//       dispatch(updateUserData({ isLoggedIn: false }));
//       navigate(APP_ROUTES.AUTH.SIGN_IN);
//     } catch (error) {
//       console.error("Logout failed", error);
//     } finally {
//       setIsModalOpen(false);
//     }
//   };

//   const toggleDropdown = (url: string) => {
//     setOpenDropdown(openDropdown === url ? null : url);
//   };

//   return (
// <div 
// className="h-screen flex flex-col justify-between bg-gradient-to-b from-[#0D2938] to-[#253B50] text-white border-r border-white/10 shadow-md"





// >

//   {/* Logo Section */}
//   <div className="px-4 py-5 border-b border-white/10">
//     {!isCollapsed && (
//       <Link to={APP_ROUTES.DASHBOARDS.PROJECT}>
//         <Text className="text-lg font-semibold tracking-tight text-white">
//           {APP_NAME}
//         </Text>
//       </Link>
//     )}
//   </div>

//   {/* Navigation */}
//   <div className="flex-1 overflow-y-auto px-3 py-4">
//     {filteredLinks.length === 0 ? (
//       <p className="text-sm text-white/60 px-2">No links for your role</p>
//     ) : (
//       filteredLinks.map((link, idx) => {
//         const isActive = location.pathname === link.url;

//         return (
//           <div key={idx} className="w-full">
//             <div
//               className={`flex items-center justify-between px-3 py-2 my-2 rounded-lg cursor-pointer transition-colors ${
//                 isActive
//                   ? "bg-white/10 text-white"
//                   : "text-white/70 hover:bg-white/5"
//               }`}
//               onClick={() => {
//                 if (link.isDropdown) toggleDropdown(link.url);
//               }}
//             >
//               {link.isDropdown ? (
//                 <div className="flex items-center gap-3 w-full">
//                   {link.Icon && <link.Icon className="text-[18px]" />}
//                   {!isCollapsed && <span className="text-sm">{link.text}</span>}
//                 </div>
//               ) : (
//                 <Link
//                   to={link.url}
//                   className="flex items-center gap-3 w-full"
//                   onClick={toggleSidebar}
//                 >
//                   {link.Icon && <link.Icon className="text-[18px]" />}
//                   {!isCollapsed && <span className="text-sm">{link.text}</span>}
//                 </Link>
//               )}
//               {!isCollapsed && link.isDropdown && (
//                 <span>
//                   {openDropdown === link.url ? (
//                     <FaChevronDown className="text-xs text-white/60" />
//                   ) : (
//                     <FaChevronRight className="text-xs text-white/60" />
//                   )}
//                 </span>
//               )}
//             </div>

//             {/* Sub Links */}
//             {!isCollapsed && link.isDropdown && openDropdown === link.url && (
//               <div className="ml-6 mt-1 space-y-1">
//                 {link.subLinks.map((sub, subIdx) => {
//                   const isSubActive = location.pathname === sub.url;
//                   return (
//                     <Link
//                       key={subIdx}
//                       to={sub.url}
//                       className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
//                         isSubActive
//                           ? "bg-white/10 text-white"
//                           : "text-white/60 hover:bg-white/5"
//                       }`}
//                       onClick={toggleSidebar}
//                     >
//                       {sub.Icon && <sub.Icon className="text-sm" />}
//                       <span>{sub.text}</span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       })
//     )}
//   </div>

//   {/* Logout Button */}
//   <div className="px-3 py-4 border-t border-white/10">
//     <button
//       onClick={() => setIsModalOpen(true)}
//       className="flex items-center gap-3 w-full text-sm text-white/70 hover:bg-white/10 px-3 py-2 rounded-md transition"
//     >
//       <FaSignOutAlt className="text-lg" />
//       {!isCollapsed && <span>Logout</span>}
//     </button>
//   </div>

//   {/* Logout Modal */}
//   <ModalContainer
//     isOpen={isModalOpen}
//     onClose={() => setIsModalOpen(false)}
//     title="Confirm Logout"
//   >
//     <p className="text-sm text-gray-200">
//       Are you sure you want to log out? You’ll need to sign in again to access your account.
//     </p>
//     <div className="flex justify-end mt-4">
//       <Button
//         text="Logout"
//         onClick={handleLogout}
//         preview="danger"
//         isSubmitting={isLoading}
//         fullWidth={false}
//       />
//     </div>
//   </ModalContainer>
// </div>

//   );
// };

// export default LeftSidebar;
