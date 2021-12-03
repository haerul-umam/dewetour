export default function TableTransaction({data}) {
    return (
        <>
            <table className="table table-borderless">
                <thead style={{borderBottom:"2px solid rgba(183, 183, 183, 0.5)"}}>
                    <tr>
                    <th>No</th>
                    <th>Full Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    </tr>
                </thead>
                <tbody >
                    <tr style={{borderBottom:"2px solid rgba(183, 183, 183, 0.5)",color:"grey"}}>
                        <td>1</td>
                        <td>{data.customer.fullName}</td>
                        <td>{data.customer.gender}</td>
                        <td>{data.customer.phone}</td>
                        <td className="text-end fw-bold text-dark">Qty :</td>
                        <td className="text-end fw-bold text-dark">{data.reservation}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className="text-end fw-bold">Total :</td>
                        <td className="text-end fw-bold" style={{color:"red"}}>{`Rp. ${data.total.toLocaleString("id-ID")}`}</td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
