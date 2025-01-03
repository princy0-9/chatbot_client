import { useState } from "react";
import styles from "./SharedModal.module.css";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const ShareDashBorad = ({ onClose }) => {
    const [selectedOption, setSelectedOption] = useState("Edit");
    const [inviteEmail, setInviteEmail] = useState('');

    const handleDropdownChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleCopyLink = () => {
        try {
            const sharedLinkCode = uuidv4();
            const sharedLink = `${window.location.origin}/dashboard/${sharedLinkCode}`;
            navigator.clipboard.writeText(sharedLink);
            toast.success("Shared link copied to clipboard");
          } catch (error) {
            toast.error("Error creating shared link");
          }
    }

    const handleInviteByEmail = async () => {
          const response = await axios.post('https://formbot-server-qzcy.onrender.com/user/invite', { email: inviteEmail });
          toast.success("Link sent successfully");

      };
  
    return (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
          <div className={styles.dropdownContainer}>
            <select
              className={styles.dropdown}
              value={selectedOption}
              onChange={handleDropdownChange}
            >
              <option value="Edit">Edit</option>
              <option value="View">View</option>
            </select>
          </div>
          <div className={styles.content}>
            <div className={styles.inputContainer}>
              <h3>Invite by Email</h3>
              <input
                type="email"
                placeholder="Enter email id"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button className={styles.button} onClick={handleInviteByEmail}>Send Invite</button>
            </div>
            <div className={styles.inputContainer}>
              <h3>Invite by link</h3>
              <button className={styles.button} onClick={handleCopyLink}>Copy link</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default ShareDashBorad;