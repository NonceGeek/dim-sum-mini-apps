import React from "react";

const UserProfile = () => {
  return (
    <div className="user-profile-wrapper flex mx-5 py-4 items-center">
      <div id="avator" className="w-12 h-12 bg-sky-200 rounded-full"></div>
      <div className="ml-3">Hello, User</div>
    </div>
  );
};

export default UserProfile;
