import "./Loading.css"

export default function Loading() {
  return (
    <>
      <div className="Wrapper">
        <div className="LoadingSpinner"></div>

        <div className="LoadingDots">
          <div className="bounce"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    </>
  );
}
