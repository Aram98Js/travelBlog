import {useState,useEffect, Fragment} from 'react'
import './blockedUsers.scss'
import { useNavigate } from 'react-router-dom'
import adminFetch from '../adminFetch'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

type BlockedUser = {
   _id: string,
   username: string,
   email:string,
   phoneNumber: string,
   violationCount: number,
   reason: string,
   blocked: boolean,
   blockedAt?:string|number
}

const BlockedUsers = () => {
const [blockedUsers,setBlockedUsers] = useState<BlockedUser[]>([]);
const [loading,setLoading] = useState<boolean>(false);
const[alertError,setAlertError] = useState("");
const {t} = useTranslation()
const navigate = useNavigate();



useEffect(()=>{
const getViolationUsers = async()=>{
    try {
        setLoading(true)
       const response = await adminFetch("http://localhost:3000/admin/violationUsers",navigate);
       if (!response) return
        const data = await response.json()
  console.log(data);
  setBlockedUsers(data.violationUsers || [])
    } catch (error) {
        if (error instanceof Error) {
        setAlertError(error.message)
    } else {
        setAlertError("Something went wrong")
    }
    }finally{
        setLoading(false)
    }
}

getViolationUsers()
},[])

    if (loading) {
        return <div className="violation-page__status"><h1>{t("loading")}</h1></div>;
    }

    if (alertError) {
        return <div className="violation-page__status error">{alertError}</div>;
    }
  return (


 <Fragment>

<Helmet>
  <title>{t("adminTitle.titleAdminBlackedLists")}</title>

  <meta
    name="description"
    content="Manage users who have violated the Travel Notes platform rules and review their violation status."
  />

  <meta
    name="keywords"
    content="Travel Notes, blacklisted users, blocked users, user violations, admin"
  />

  <meta
    name="robots"
    content="noindex, nofollow"
  />

  <meta
    property="og:title"
    content="Blacklisted Users | Travel Notes"
  />

  <meta
    property="og:description"
    content="Manage and review blacklisted users and their violation status on Travel Notes."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>

<section className="violation-page">
            <div className="violation-page__header">
                <div>
                    <h1>Violation Users</h1>
                    <p>Users who have violated chatbot rules</p>
                </div>

                <span className="violation-page__count">
                    Total: {blockedUsers.length}
                </span>
            </div>

            {blockedUsers.length === 0 ? (
                <div className="violation-page__empty">
                    No violation users found.
                </div>
            ) : (
                <div className="violation-table-wrapper">
                    <table className="violation-table">
                        <thead>
                            <tr>
                                <th>{t("adminBlackListTable.username")}</th>
                                <th>{t("adminBlackListTable.email")}</th>
                                <th>{t("adminBlackListTable.phone")}</th>
                                <th>{t("adminBlackListTable.violation")}</th>
                                <th>{t("adminBlackListTable.reason")}</th>
                                <th>{t("adminBlackListTable.status")}</th>
                                <th>{t("adminBlackListTable.blockedAt")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {blockedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNumber}</td>

                                    <td>
                                        <span className="violation-number">
                                            {user.violationCount}
                                        </span>
                                    </td>

                                    <td>{user.reason}</td>

                                    <td>
                                        <span
                                            className={`status-badge ${
                                                user.blocked
                                                    ? "blocked"
                                                    : "active"
                                            }`}
                                        >
                                            {user.blocked ? "Blocked" : "Active"}
                                        </span>
                                    </td>

                                    <td>
                                        {user.blockedAt
                                            ? new Date(
                                                  user.blockedAt
                                              ).toLocaleString()
                                            : "Not blocked"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>


 </Fragment>



  
  )
}

export default BlockedUsers