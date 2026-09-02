
import { Fragment } from "react/jsx-runtime";
import "./privacyPolicy.scss";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
const PrivacyPolicy = () => {
    const {t} = useTranslation()
  return (
    <Fragment>
<Helmet>
  <title>{t("pagesTitle.privacyPage")}</title>

  <meta
    name="description"
    content="Learn how Travel Notes collects, uses, protects, and manages user data on this educational travel website."
  />

  <meta
    name="keywords"
    content="Travel Notes, Privacy Policy, user data, data protection, privacy, educational travel website"
  />

  <meta
    property="og:title"
    content="Privacy Policy | Travel Notes"
  />

  <meta
    property="og:description"
    content="Learn how Travel Notes collects, uses, protects, and manages user data on this educational travel website."
  />

  <meta
    property="og:type"
    content="website"
  />
</Helmet>
      <section className="privacy-policy">
      <div className="privacy-policy__container">

        <div className="privacy-policy__header">
          <h1>
           {t("privacyPolicy.header.one")}
          </h1>

          <p>
            {t("privacyPolicy.paragraph.one")}
          </p>
        </div>


        <div className="privacy-policy__content">

          {/* 01 */}
          <article className="privacy-section">
            <div className="privacy-section__number">01</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_one")}</h2>

              <p>
                <strong>1.1.</strong> {t("privacyPolicy.paragraph.one_dot_one")}
              </p>

              <p>
                <strong>1.2.</strong> {t("privacyPolicy.paragraph.one_dot_one_two")}
              </p>

              <p>
                <strong>1.3.</strong> {t("privacyPolicy.paragraph.one_dot_one_three")}
              </p>
            </div>
          </article>


          {/* 02 */}
          <article className="privacy-section">
            <div className="privacy-section__number">02</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_two")}</h2>

              <p>
                <strong>2.1.</strong> {t("privacyPolicy.paragraph.one_dot_two")}
              </p>

              <p>
                <strong>2.2.</strong> {t("privacyPolicy.paragraph.one_dot_two_two")}
              </p>

              <p>
                <strong>2.3.</strong> {t("privacyPolicy.paragraph.one_dot_two_three")}
              </p>
            </div>
          </article>


          {/* 03 */}
          <article className="privacy-section">
            <div className="privacy-section__number">03</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_three")}</h2>

              <p>
                <strong>3.1.</strong>  {t("privacyPolicy.paragraph.one_dot_three")}
              </p>

              <ul>
                <li>{t("privacyPolicy.dataList.username")}</li>
                <li>{t("privacyPolicy.dataList.email")}</li>
                <li>{t("privacyPolicy.dataList.password")}</li>
                <li>{t("privacyPolicy.dataList.profile")}</li>
                <li>{t("privacyPolicy.dataList.notifications")}</li>
              </ul>

              <p>
                <strong>3.2.</strong>{t("privacyPolicy.paragraph.one_dot_three_two")}
              </p>
            </div>
          </article>


          {/* 04 */}
          <article className="privacy-section">
            <div className="privacy-section__number">04</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_four")}</h2>

              <p>
                <strong>4.1.</strong> {t("privacyPolicy.paragraph.one_dot_four")}
              </p>

              <p>
                {t("privacyPolicy.paragraph.one_dot_four_two")}
              </p>

              <ul>
                <li> {t("privacyPolicy.dataUsageList.registration")}</li>
                <li>{t("privacyPolicy.dataUsageList.authentication")}</li>
                <li>{t("privacyPolicy.dataUsageList.profile")}</li>
                <li>{t("privacyPolicy.dataUsageList.password")}</li>
                <li>{t("privacyPolicy.dataUsageList.notifications")}</li>
                <li>{t("privacyPolicy.dataUsageList.account")}</li>
              </ul>
            </div>
          </article>


          {/* 05 */}
          <article className="privacy-section">
            <div className="privacy-section__number">05</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_five")}</h2>

              <p>
                <strong>5.1.</strong>  {t("privacyPolicy.paragraph.one_dot_five")}
              </p>

              <p>
                <strong>5.2.</strong> {t("privacyPolicy.paragraph.one_dot_five_two")}
              </p>

              <p>
                <strong>5.3.</strong>{t("privacyPolicy.paragraph.one_dot_five_three")}
              </p>

          <ul>
  <li>{t("privacyPolicy.storageList.accessToken")}</li>
  <li>{t("privacyPolicy.storageList.refreshToken")}</li>
  <li>{t("privacyPolicy.storageList.userData")}</li>
  <li>{t("privacyPolicy.storageList.preferences")}</li>
</ul>
            </div>
          </article>


          {/* 06 */}
          <article className="privacy-section">
            <div className="privacy-section__number">06</div>

            <div className="privacy-section__body">
              <h2>{t("privacyPolicy.header.one_dot_six")}</h2>

              <p>
                <strong>6.1.</strong> {t("privacyPolicy.paragraph.one_dot_six")}
              </p>

              <p>
                {t("privacyPolicy.paragraph.one_dot_six_two")}
              </p>

           <ul>
  <li>{t("privacyPolicy.accountActionsList.profile")}</li>
  <li>{t("privacyPolicy.accountActionsList.password")}</li>
  <li>{t("privacyPolicy.accountActionsList.logout")}</li>
  <li>{t("privacyPolicy.accountActionsList.delete")}</li>
</ul>

              <p>
                <strong>6.2.</strong> {t("privacyPolicy.paragraph.one_dot_six_three")}
              </p>
            </div>
          </article>


          {/* 07 */}
          <article className="privacy-section privacy-section--highlight">
            <div className="privacy-section__number">07</div>

            <div className="privacy-section__body">
              <h2><h2>{t("privacyPolicy.header.one_dot_seven")}</h2></h2>

              <p>
                <strong>7.1.</strong>  {t("privacyPolicy.paragraph.one_dot_seven")}
              </p>

              <p>
                <strong>7.2.</strong> {t("privacyPolicy.paragraph.one_dot_seven_two")}
              </p>

              <p>
                <strong>7.3.</strong> {t("privacyPolicy.paragraph.one_dot_seven_three")}
              </p>

              <p>
                <strong>7.4.</strong> {t("privacyPolicy.paragraph.one_dot_seven_four")}
              </p>
            </div>
          </article>

        </div>
      </div>
    </section>
    </Fragment>
    
  );
};

export default PrivacyPolicy;

