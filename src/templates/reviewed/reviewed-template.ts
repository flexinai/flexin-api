export const reviewedTemplate = (videoId: number) => {
  return `
  <mjml version="3.3.3">
  <mj-body background-color="#F4F4F4" color="#55575d" font-family="Arial, sans-serif">
    <mj-section
      background-color="#00ffff"
      background-repeat="repeat"
      padding="20px 0"
      text-align="center"
      vertical-align="top"
    >
      <mj-column>
        <mj-image align="center" padding="10px 25px" src="https://i.imgur.com/lQwklvU.png" width="200px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section
      background-color="#000000"
      background-repeat="repeat"
      padding="20px 0"
      text-align="center"
      vertical-align="top"
    >
      <mj-column>
        <mj-image
          align="center"
          alt="Keep on Flexin"
          container-background-color="#000000"
          padding="10px 25px"
          src="https://fontmeme.com/permalink/210909/657a4fda407e83615008b20f9c0f7ea9.png"
          width="180px"
        ></mj-image>
        <mj-image align="center" padding="10px 25px" src="https://i.imgur.com/Yjyzt8f.gif" width="400px"></mj-image>
      </mj-column>
    </mj-section>
    <mj-section
      background-color="#000000"
      background-repeat="repeat"
      background-size="auto"
      padding="20px 0px 20px 0px"
      text-align="center"
      vertical-align="top"
    >
      <mj-column>
        <mj-text
          align="center"
          color="#ffffff"
          font-family="Arial, sans-serif"
          font-size="16px"
          line-height="28px"
          padding="0px 25px 0px 25px"
          ><a href="www.flexin.io/review/${videoId}" style="color: white; text-decoration: underline"
            >find out what your coach said</a
          >
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section
      background-color="#00ffff"
      background-repeat="repeat"
      padding="20px 0"
      text-align="left"
      vertical-align="top"
    >
      <mj-column>
        <mj-text></mj-text>
      </mj-column>
    </mj-section>
    <mj-section
      background-repeat="repeat"
      background-size="auto"
      padding="20px 0px 20px 0px"
      text-align="left"
      vertical-align="top"
    >
      <mj-column>
        <mj-text
          align="center"
          color="#55575d"
          font-family="Arial, sans-serif"
          font-size="11px"
          line-height="22px"
          padding="0px 20px"
        ></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `;
};
