import React from "react";

export default function ChangePasswordModal({ uploadPassword }) {
  return (
    <div>
      <div
        className="modal fade"
        id="passwordBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="passwordBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-center">
          <div className="modal-content">
            <form action="#" onSubmit={(e) => uploadPassword(e)} method="post">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="passwordBackdropLabel">
                  Change Password
                </h1>
                <button
                  type="button"
                  id="passwordModalButton"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Enter Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    id="currentPassword"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    id="newPassword"
                    required
                    aria-describedby="helpId"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPasswordAgain" className="form-label">
                    Enter New Password Again
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPasswordAgain"
                    id="newPasswordAgain"
                    required
                    aria-describedby="helpId"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-danger">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
