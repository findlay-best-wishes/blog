<template>
    <div style = "margin-top:2%">
        <a target="_blank" href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=BzI3PzU_Pjc_P0d2dilkaGo" style="text-decoration:none;">
          <img src="../public/email.jpg" class = "email"/>
        </a>
        <img src="../public/vx.jpg" class = "vx">
    </div>
</template>

<script>
  export default {
    name: 'contactMe',
  }
</script>

<style scope>
  .email {
    width: 25%;
    border: 1px hidden black;
    border-radius: 8%;
  }

  .vx {
    width: 25%;
    border: 1px hidden black;
    border-radius: 8%;
    margin-left: 10px;
  }

  @media screen and (min-width:1025px){
    .vx {
      width: 10%;
    }
    .email {
      width: 10%;
    }
  }
</style>