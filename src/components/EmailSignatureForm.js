import React, { useState, useEffect } from "react";
import { Fade } from "react-reveal";
import GeneratedSignature from "./GeneratedSignature";
// import loadinganimation from "../video/Habitat-Logo-Animation-V2.mp4";
import SVGloader from "./SVGloader";
import defaultEmployeeImage from "../img/placeholder.png";

function EmailSignatureForm() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    phoneNumber: "",
    color: "#EA0707",
  });


  const [images, setImages] = useState([]);
  const [cultureImagesReady, setCultureImagesReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadImage = async (src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;

      if (image.decode) {
        await image.decode();
      } else {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = () =>
            reject(new Error(`Failed to preload image: ${src}`));
        });
      }

      return src;
    };

    const fetchData = async () => {
      try {
        const timestamp = Date.now();

        // Culture Images Table
        const response = await fetch(
          `https://api.airtable.com/v0/appP6GPZNr7y1QSs9/tblQIwfFOBZq5ku0t?timestamp=${timestamp}`,
          {
            headers: {
              Authorization:
                "Bearer patt8f792MHQMgVvF.04577d4f40ddf573d332ed592b73658f2344c9525864133f19b48b0a4040259e",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Airtable request failed: ${response.status} ${errorText}`
          );
        }

        const data = await response.json();

        const availableImages = data.records
          .map((record) => {
            const attachment = record.fields.Attachments?.[0];

            return (
              attachment?.thumbnails?.full?.url ||
              attachment?.url ||
              null
            );
          })
          .filter(Boolean);

        const selectedImages = [...availableImages]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const preloadedImages = await Promise.all(
          selectedImages.map(preloadImage)
        );

        if (isMounted) {
          setImages(preloadedImages);
          setCultureImagesReady(true);
        }
      } catch (error) {
        console.error("Error loading culture images:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is the phone number field
    if (name === "phoneNumber") {
      // Remove non-numeric characters
      const numericPhoneNumber = value.replace(/\D/g, "");

      // Enforce the character limit of 10
      const truncatedPhoneNumber = numericPhoneNumber.slice(0, 10);

      // Format the truncated phone number as ###.###.###
      const formattedPhoneNumber = truncatedPhoneNumber.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "$1.$2.$3"
      );

      setFormData({
        ...formData,
        [name]: formattedPhoneNumber,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleColorClick = (color) => {
    setFormData({
      ...formData,
      color,
    });
  };

  const searchForEmployeeImage = async (offset, retryCount = 0) => {
    try {
      // Employee Images Table
      const response = await fetch(
        `https://api.airtable.com/v0/appP6GPZNr7y1QSs9/tblV8uywcMco7HEFe?offset=${offset}`,
        {
          headers: {
            Authorization:
              "Bearer patt8f792MHQMgVvF.04577d4f40ddf573d332ed592b73658f2344c9525864133f19b48b0a4040259e",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from Airtable");
      }

      const data = await response.json();
      var fileName = `${formData.firstName}${formData.lastName}.png`
        .toLowerCase() // convert to lowercase
        .replace(/\s/g, ""); // remove extra spaces

      // alert(fileName);

      // Log all unique entries
      const uniqueEntries = new Set(
        data.records.map((record) =>
          record.fields.Attachments[0].filename.toLowerCase()
        )
      ); // Convert to lowercase
      console.log("Unique Entries:", Array.from(uniqueEntries));

      // Find the record with the matching filename in the Airtable API response
      const matchingRecord = data.records.find((record) => {
        const attachments = record.fields.Attachments;
        return (
          attachments &&
          attachments.length > 0 &&
          attachments[0].filename.toLowerCase() === fileName
        );
      });

      if (matchingRecord) {
        return matchingRecord.fields.Attachments[0].thumbnails.full.url;
      } else if (data.offset && retryCount < 2) {
        // If there are no matching records and there's more data, retry with the new offset
        return searchForEmployeeImage(data.offset, retryCount + 1);
      } else {
        // If no matching record is found and no more data is available, return null
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from Airtable:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const offset = ""; // Start with an empty offset
      const employeeImage = await searchForEmployeeImage(offset);

      const cleanedFirstName = formData.firstName.replace(/\s+/g, " ").trim();
      const cleanedLastName = formData.lastName.replace(/\s+/g, " ").trim();

      const fullName = `${cleanedFirstName} ${cleanedLastName}`;

      if (employeeImage) {
        setTimeout(() => {
          setResults((prevResults) => (
            <GeneratedSignature
              fullName={fullName}
              jobTitle={formData.jobTitle}
              phoneNumber={formData.phoneNumber}
              emailAddress={formData.emailAddress}
              address={formData.address}
              color={formData.color}
              employeeImage={employeeImage}
            />
          ));

          setLoading(false);
        }, 1500);
      } else {
        setTimeout(() => {
          // Handle the case where the image doesn't exist in the Airtable response
          setResults((prevResults) => (
            <GeneratedSignature
              fullName={fullName}
              jobTitle={formData.jobTitle}
              phoneNumber={formData.phoneNumber}
              emailAddress={formData.emailAddress}
              address={formData.address}
              color={formData.color} // Pass the color prop
              employeeImage={defaultEmployeeImage} // Pass null for the employee image
            />
          ));

          setLoading(false);
        }, 1500);
      }
    } catch (error) {
      setTimeout(() => {
        console.error("Error fetching data from Airtable:", error);
        setLoading(false);
      }, 1500);
    }
  };

  const handleGoBack = () => {
    setLoading(true); // Set loading to true

    // Simulate a delay before resetting the form and stopping the loader
    setTimeout(() => {
      setResults(null);
      setCopied(false);
      setFormData({
        firstName: `${formData.firstName}`,
        lastName: `${formData.lastName}`,
        jobTitle: `${formData.jobTitle}`,
        phoneNumber: `${formData.phoneNumber}`,
        emailAddress: `${formData.emailAddress}`,
        color: `${formData.color}`,
      });
      setLoading(false); // Set loading back to false after the delay
    }, 1500); // Adjust the timeout duration as needed
  };

  const handleCopyToClipboard = () => {
    const content = document.getElementById("content");
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(content);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      // Attempt to copy the selected content
      const success = document.execCommand("copy");

      if (success) {
        console.log("Content copied to clipboard");
        // You may want to set a state variable or perform other actions here
      } else {
        console.error("Unable to copy content to clipboard");
        // Handle the case where copying fails
      }
    } catch (err) {
      console.error("Error copying content to clipboard:", err);
      // Handle any errors that may occur during copying
    }
  };

  return (
    <div className="container max-width-md">
      <div className="grid gap-lg justify-center height-100vh items-center">
        {loading ? (
          // <video
          //   className="loader"
          //   disablePictureInPicture
          //   playsInline
          //   autoPlay
          //   loop
          //   muted
          // >
          //   <source src={loadinganimation} type="video/mp4" />
          // </video>
        <SVGloader />
        ) : results ? (
          <>
            <div>
              <Fade top cascade>
                <div className="grid gap-md justify-center margin-y-0">
                  <div className="col-12 margin-bottom-sm margin-top-lg margin-top-0@md">
                    <h1 className="margin-0 text-lg font-secondary ">
                      <span style={{color: "#EA0707"}}>Email Signature</span> Generator
                    </h1>
                  </div>
                </div>
              </Fade>
              <Fade top cascade>
                <div className="grid gap-md justify-center">
                  <div className="col-12 col@md">
                    <Fade top cascade>
                      <div
                        className="tableContainer padding-y-xl padding-x-lg radius-lg"
                        style={{
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            margin: "0 auto",
                          }}
                          id="content"
                          className="highlightable"
                        >
                          <p>{results}</p>
                        </div>
                      </div>

                      <div>
                        <div className="buttons-component sig-marquee">
                            <button className="btn button--habitat width-100%"
                              style={{ background: "#fff" }}>
                            <span>Nice Headshot</span>
                            <div className="marquee" aria-hidden="true">
                              <div className="marquee__inner">
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                                <span>Nice Headshot</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </Fade>
                  </div>

                  <div className="col-12 col@md">
                    <div
                      className="padding-lg radius-lg"
                      style={{ background: "#FFFFFF", color: "#070F0B" }}
                    >
                      <h2 className="text-md font-secondary margin-bottom-xs">
                        Instructions:
                      </h2>
                      <ul className="font-primary instructions">
                        <li className="">Click Copy to Clipboard</li>
                        <li className="">
                          Outlook &gt; Settings &gt; Signatures &gt; Edit
                        </li>
                        <li className="">
                          Delete all the content and paste your email signature
                          &gt; Save
                        </li>
                        <li className="">
                          You can rename the “Standard” email signature to
                          Habitat
                        </li>
                        <li className="">
                          Under “Choose Default Signature” Select your email
                          signature for “New Messages” and “Replies/Forward”
                        </li>
                        <li className="">You're done!</li>
                      </ul>
                    </div>
                    <div className="text-center text-right@md">
                      <button
                        onClick={handleCopyToClipboard}
                        className="margin-top-md btn btn--primary padding-y-xs margin-right-sm"
                          id="highlightButton"
                      >
                        {copied ? "HTML Copied!" : "Copy to Clipboard"}
                      </button>
                      <Fade top cascade>
                        <button
                          className="margin-top-md btn btn--primary padding-y-xs"
                          onClick={handleGoBack}
                        >
                          Back
                        </button>
                      </Fade>
                    </div>
                  </div>
                </div>
              </Fade>
            </div>
          </>
        ) : (
          <>
            <div className="col-12 col@md margin-top-lg order-1 order-1@md">
              {cultureImagesReady && (
                <>
              <Fade left>
                <div className="grid gap-md margin-bottom-0">
                  <div
                    className="col radius-lg  aspect-ratio-5:4"
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    {images[0] && (
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={images[0]}
                        alt="Culture"
                        decoding="sync"
                        loading="eager"
                        fetchPriority="high"
                        onError={(e) =>
                          console.log(`Error loading image: ${e.target.src}`)
                        }
                      />
                    )}
                  </div>
                </div>
                {/* <Airtable /> */}
              </Fade>

              <Fade left cascade>
                <div className="grid gap-md">
                  {images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="col radius-lg culture-container"
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        key={index}
                        src={image}
                        alt={`Culture ${index + 2}`}
                        decoding="sync"
                        loading="eager"
                        onError={(e) =>
                          console.log(`Error loading image: ${e.target.src}`)
                        }
                      />
                    </div>
                  ))}
                </div>
              </Fade>
                </>
              )}
            </div>

            <div className="col-12 col@md margin-top-sm margin-top-lg@md order-2 order-2@md">
              <Fade bottom>
                <h1 className="font-secondary text-lg ">
                  <span style={{color: "#EA0707"}}>Email Signature</span> Generator
                </h1>
              </Fade>

              <div id="emailsigform" className="margin-top-sm">
                <Fade bottom cascade>
                  <form onSubmit={handleSubmit} className="">
                    <div>
                      <label className="block " htmlFor="first-name">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block" htmlFor="last-name">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block" htmlFor="job-title">
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="job-title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block" htmlFor="phone-number">
                        Your Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="phone-number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        style={{ marginBottom: "0" }}
                      />
                      <p className="text-sm font-italic margin-top-xxxs margin-bottom-md">
                        If you leave this blank the office phone number will be
                        added
                      </p>
                    </div>
                    <div>
                      <label className="block">
                        Select your background color:
                      </label>
                      <div className="grid gap-sm">
                        <Fade bottom cascade>
                          <div className="col">
                            <div
                              className={`radio-container bg-red radius-md padding-left-xl padding-left-lg@md padding-right-sm padding-y-xs margin-y-sm  ${
                                formData.color === "#EA0707" ? "selected" : ""
                              }`}
                              onClick={() => handleColorClick("#EA0707")}
                            >
                              <input
                                type="radio"
                                id="red"
                                name="color"
                                value="red"
                                checked={formData.color === "#EA0707"}
                                onChange={handleChange}
                              />
                              <label htmlFor="red">HD Red</label>
                              <span className="agency-radio"></span>
                            </div>

                            <div
                              className={`radio-container bg-subtle radius-md padding-left-xl padding-left-lg@md padding-right-sm padding-y-xs margin-y-sm  ${
                                formData.color === "#F1F1F1" ? "selected" : ""
                              }`}
                              onClick={() => handleColorClick("#F1F1F1")}
                            >
                              <input
                                type="radio"
                                id="subtle"
                                name="color"
                                value="subtle"
                                checked={formData.color === "#F1F1F1"}
                                onChange={handleChange}
                              />
                              <label htmlFor="subtle">Subtle</label>
                              <span className="agency-radio"></span>
                            </div>
                          </div>
                          <div className="col">
                            <div
                              className={`radio-container bg-black radius-md padding-left-xl padding-left-lg@md padding-right-sm padding-y-xs margin-y-sm  ${
                                formData.color === "#000000" ? "selected" : ""
                              }`}
                              onClick={() => handleColorClick("#000000")}
                            >
                              <input
                                type="radio"
                                id="bold"
                                name="color"
                                value="bold"
                                checked={formData.color === "#000000"}
                                onChange={handleChange}
                              />
                              <label htmlFor="bold">Bold</label>
                              <span className="agency-radio"></span>
                            </div>

                            <div
                              className={`radio-container bg-millenial radius-md padding-left-xl padding-left-lg@md padding-right-sm padding-y-xs margin-y-sm  ${
                                formData.color === "#D1D1D1" ? "selected" : ""
                              }`}
                              onClick={() => handleColorClick("#D1D1D1")}
                            >
                              <input
                                type="radio"
                                id="millenial"
                                name="color"
                                value="millenial"
                                checked={formData.color === "#D1D1D1"}
                                onChange={handleChange}
                              />
                              <label htmlFor="millenial">Millenial Grey</label>
                              <span className="agency-radio"></span>
                            </div>
                          </div>
                        </Fade>
                      </div>
                      <button
                        className="btn btn--primary padding-y-xs"
                        type="submit"
                      >
                        Generate Signature
                      </button>
                    </div>
                  </form>
                </Fade>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmailSignatureForm;