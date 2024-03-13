import { PageContainer } from "@ant-design/pro-components";

// const useStyles = createStyles(({ token, css }) => {
//   return {
//     toDoTip: css`
//       padding: 15px 30px 15px 0px;
//       border-bottom: 1px dotted #aca9a9;
//       display: flex;
//       > p:nth-of-type(1) {
//         margin-left: 10px;
//       }
//       > p:nth-of-type(2) {
//         flex: 1;
//         font-weight: 900;
//         font-size: 30px;
//         color: #505050;
//         margin: 0;
//         display: flex;
//         justify-content: end;
//         align-items: flex-end;
//       }
//     `,
//     container_two_right_title: css({
//       width: "5px",
//       height: "14px",
//       backgroundColor: "red",
//       marginRight: "10px",
//       marginTop: "5px",
//     }),
//     container_two_right_item: css`
//       display: flex;
//       /* flex-direction: column; */
//       div {
//         p {
//           width: 100%;
//           font-size: 14px;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }
//       }
//     `,
//     container_two_right_level1: css`
//       width: 100px;
//       height: 32px;
//       line-height: 32px;
//       text-align: center;
//       color: #fff;
//       background-color: #2f80ed;
//       margin-right: 27px;
//       padding: 0px 5px;
//     `,
//   };
// });

export default () => {
  return (
    <div>
      <PageContainer
        {...{
          title: " ",
          ghost: true,
          token: {
            paddingBlockPageContainerContent: 10,
            paddingInlinePageContainerContent: 50,
          },
        }}
      >
        1
        {/* <ProCard gutter={30} ghost>
          <ProCard colSpan={8} title='Welcome,Jackson' style={{ height: "100%" }}>
            <div className={styles.toDoTip}>
              <img width={64} src={titleToDo} alt='' />
              <p>To do</p>
              <p>3</p>
            </div>
            <div className={styles.toDoTip}>
              <img width={64} src={titleToDo} alt='' />
              <p>To do</p>
              <p>3</p>
            </div>
            <div className={styles.toDoTip}>
              <img width={64} src={titleToDo} alt='' />
              <p>To do</p>
              <p>3</p>
            </div>
          </ProCard>
          <ProCard colSpan={16}>
            <ProCard>
              <img width={300} height={300} src={bgImage} alt='' />
            </ProCard>
            <ProCard
              title={
                <p style={{ display: "flex", fontWeight: "900" }}>
                  <p className={styles.container_two_right_title} />
                  Announcement
                </p>
              }
              extra={<a>more</a>}
            >
              <div className={styles.container_two_right_item}>
                <p className={styles.container_two_right_level1}>Newest</p>
                <div>
                  <p>新员工入职培训通知（培训地点：主楼负一层培训室）</p>
                  <p>2019年12月4日，高峰论坛于2019中国电子家电出版社发布</p>
                  <p>
                    <img width={14} src={clock} alt='' />
                    <span style={{ color: "#fe4604", paddingLeft: "10px" }}>2023-10-25</span>
                  </p>
                </div>
              </div>
              <div className={styles.container_two_right_item}>
                <p className={styles.container_two_right_level1}>Hot</p>
                <div>
                  <p>新员工入职培训通知（培训地点：主楼负一层培训室）</p>
                  <p>2019年12月4日，高峰论坛于2019中国电子家电出版社发布</p>
                  <p>
                    <img width={14} src={clock} alt='' />
                    <span style={{ color: "#fe4604", paddingLeft: "10px" }}>2023-07-01</span>
                  </p>
                </div>
              </div>
              <div className={styles.container_two_right_item}>
                <p className={styles.container_two_right_level1}>Hot</p>
                <div>
                  <p>新员工入职培训通知（培训地点：主楼负一层培训室）</p>
                  <p>2019年12月4日，高峰论坛于2019中国电子家电出版社发布</p>
                  <p>
                    <img width={14} src={clock} alt='' />
                    <span style={{ color: "#fe4604", paddingLeft: "10px" }}>2022-12-13</span>
                  </p>
                </div>
              </div>
            </ProCard>
          </ProCard>
        </ProCard>

        <ProCard gutter={30} style={{ backgroundColor: "yellowgreen", marginTop: "30px" }}>
          <ProCard colSpan={8} title='Quick Links'>
            1
          </ProCard>
          <ProCard colSpan={16}>1</ProCard>
        </ProCard> */}
      </PageContainer>
    </div>
  );
};
