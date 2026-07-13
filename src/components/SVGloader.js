import "../styles/components/_SVGloader.scss";

export default function SVGloader() {
  return (
    <div className="camera-loader">
      <div className="camera">
        <div className="flash"></div>
        <div className="top"></div>

        <div className="body">
          <div className="dot"></div>

          <div className="lens">
            <div className="glass"></div>
          </div>
        </div>
      </div>
    </div>
  );
}