import React from "react";
import logo from "../img/logo.png";
import facebookIcon from "../img/facebook.png";
// import tiktokIcon from "../img/tiktok.png";
import youtubeIcon from "../img/youtube.png";
import instagramIcon from "../img/instagram.png";
import linkedinIcon from "../img/linkedin.png";
import lineSeperator from "../img/line-seperator.png";
import lineSeperatorTop from "../img/line-seperator-top.png";

function GeneratedSignature({
  fullName,
  jobTitle,
  phoneNumber,
  emailAddress,
  address,
  employeeImage,
  color,
}) {
  const textColor =
    color === "#EA0707" || color === "#000000" ? "#FFFFFF" : "#2C2C2A";

  return (
    <table className="generatedSignature" border="0" width="250">
      <tbody style={{ verticalAlign: "bottom" }}>
        <tr style={{ verticalAlign: "bottom" }}>
          <td width="130" rowSpan="8" style={{ verticalAlign: "bottom" }}>
            <p style={{ textAlign: "center" }}>
              <img
                width="150"
                src={employeeImage}
                alt="Nice Headshot"
                style={{ verticalAlign: "bottom" }}
              />
            </p>
          </td>
          <td width="5" rowSpan="8">
            &nbsp;&nbsp;&nbsp;
          </td>
          <td width="12" rowSpan="8">
            &nbsp;&nbsp;&nbsp;
          </td>
        </tr>

        <tr>
          <td width="100%" style={{ textAlign: "center" }}>
            <p>
              <img width="150" className="logo" src={logo} alt="Logo" />
            </p>
          </td>
        </tr>

        <tr>
          <td width="100%" style={{ textAlign: "center" }}>
            <p style={{ lineHeight: "0", fontSize: 0 }}>
              <img width="150" src={lineSeperatorTop} alt="Separator" />
            </p>
          </td>
        </tr>

        <tr>
          <td
            width="100%"
            style={{
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              color: "#070F0B",
              fontSize: "12px",
              fontWeight: "normal",
            }}
          >
            <font face="'Helvetica', 'Arial', sans-serif">
              {phoneNumber ? phoneNumber : "817.332.4600"}
            </font>
          </td>
        </tr>

        <tr>
          <td width="100%" style={{ textAlign: "center" }}>
            <p
              className="hide-if-no-phone-number"
              style={{ lineHeight: "0", fontSize: 0 }}
            >
              <img width="150" src={lineSeperator} alt="Separator" />
            </p>
          </td>
        </tr>

        <tr>
          <td
            width="100%"
            style={{
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              color: "#070F0B",
              fontSize: "12px",
              fontWeight: "normal",
            }}
          >
            <a
              style={{
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                color: "#070F0B",
                fontSize: "12px",
                fontWeight: "normal",
              }}
              href="https://hdphotohub.com/"
            >
              <font face="'Helvetica', 'Arial', sans-serif">
                HDPHOTOHUB.COM
              </font>
            </a>
          </td>
        </tr>

        <tr>
          <td width="100%" style={{ textAlign: "center" }}>
            <p style={{ lineHeight: "0", fontSize: 0 }}>
              <img width="150" src={lineSeperator} alt="Separator" />
            </p>
          </td>
        </tr>

        <tr>
          <td
            width="100%"
            style={{
              textAlign: "center",
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              color: "#003865",
              fontSize: "6px",
              fontWeight: "normal",
            }}
          >
            <a
              href="https://www.linkedin.com/company/hdphotohub/"
              style={{ textDecoration: "none" }}
            >
              <img src={linkedinIcon} alt="LinkedIn" width="30" border="0" />
            </a>
            &nbsp;&nbsp;
            <a
              href="https://www.youtube.com/@HDPhotoHub"
              style={{ textDecoration: "none" }}
            >
              <img src={youtubeIcon} alt="YouTube" width="35" border="0" />
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a
              href="https://www.instagram.com/hdphotohub/"
              style={{ textDecoration: "none" }}
            >
              <img src={instagramIcon} alt="Instagram" width="30" border="0" />
            </a>
            &nbsp;&nbsp;
            <a
              href="https://www.facebook.com/hdphotohub"
              style={{ textDecoration: "none", top: "1px", position: "relative" }}
            >
              <img src={facebookIcon} alt="Facebook" width="35" border="0" style={{top: "1px", position: "relative"}} />
            </a>
          </td>
        </tr>

        <tr>
          <td colSpan="4" height="10"></td>
        </tr>

        <tr style={{ backgroundColor: color }}>
          <td
            colSpan="4"
            style={{
              padding: "0.8em 1em",
              fontWeight: "normal",
              fontFamily: "'Helvetica', 'Arial', sans-serif",
              color: textColor,
              fontSize: "20px",
            }}
          >
            <font face="'Helvetica', 'Arial', sans-serif">{fullName}</font>
            <p
              style={{
                textTransform: "uppercase",
                fontFamily: "'Helvetica', 'Arial', sans-serif",
                color: textColor,
                fontSize: "12px",
                fontWeight: "normal",
                lineHeight: "20px",
              }}
            >
              <font face="'Helvetica', 'Arial', sans-serif">{jobTitle}</font>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default GeneratedSignature;