import { useNavigate } from "react-router-dom"

function PartnerNotice() {
  const navigate = useNavigate()
  return (
    <div>
      <h1>
        Your partner registration is under review. We will notify you via email once it's approved.
      </h1>
      <p>
        Thank you for your patience.
      </p>
      <button onClick={() => navigate("/")}>Home</button>
    </div>
  )
}

export default PartnerNotice
