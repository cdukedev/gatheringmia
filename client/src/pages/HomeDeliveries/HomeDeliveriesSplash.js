import React from "react";
import styles from "./Splash.module.scss";
import splashLogo from "../../assets/images/splash-logo.png";

function Splash() {
  return (
    <section className={styles.container}>
      <div className={styles.splash}>
        <img className={styles["splash-logo"]} src={splashLogo} alt="Gathering logo" />
      </div>

      <div className={styles.container}>
        <div className={styles["animation-wrapper"]}>
          <div id="img1" className={styles.img}>
            <div id="img2" className={styles.img}>
              <div id="img3" className={styles.img}>
                <div id="img4" className={styles.img}>
                  <div id="img5" className={styles.img}>
                    <div id="img6" className={styles.img}>
                      <div id="img7" className={styles.img}>
                        <div id="img8" className={styles.img}>
                          <div id="img9" className={styles.img}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Splash;
