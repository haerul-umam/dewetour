export default function ProfileInfo({data}) {
  return (
    <>
      <div className="d-flex" style={{ lineHeight: "20px" }}>
        <img src={`/assets/icons/${data.img}`} alt="" width="40" height="40" className="me-2" />
        <div>
          <p className="fw-bold m-0">
            {data.name}
          </p>
          <p className="font-grey">{data.info}</p>
        </div>
      </div>
    </>
  );
}
