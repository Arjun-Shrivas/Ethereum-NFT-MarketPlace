import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles({
  pageCreateNft: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
    borderRadius : "10px",
    background : "white",
    
    

    '& form': {
      
      maxWidth: "730px",
      background: "#FFF",
      borderRadius: "8px",
    
      display: "flex",
      flexDirection: "column",

      '& fieldset': {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",

        width: "400px",
        minWidth: "240px",
        marginTop: "64px",
        marginLeft: "2rem",
        minInlineSize: "auto",
        border: "0",
      }
    }
  },

  formHeader: {
    display: "flex",
    alignItems: "baseline",
    padding : "10px",
    width: "-webkit-fill-available",
    padding: "10px",

    '& h1': {
      fontSize: "36px",
    },

    '& a': {
      marginLeft: "auto",
      marginRight: "1.5rem",
    }
  },

  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "initial",
  },

  dropzone: {
    minWidth: "500px",
    marginRight: "50px"

  }
});

export { useStyles };