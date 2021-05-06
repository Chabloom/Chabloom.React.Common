import * as React from "react";
import { UserManager } from "oidc-client";
import { createStyles, Grid, Paper, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Status } from "./Status";

import logo from "../images/chabloom-icon.svg";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(5),
    },
    mt1: {
      marginTop: theme.spacing(1),
    },
  })
);

interface Props {
  userManager: UserManager,
}

export const SignOutCallback: React.FC<Props> = ({userManager}) => {
  // Initialize classes
  const classes = useStyles();

  // Initialize state variables
  const [error, setError] = React.useState("");
  const [processing, setProcessing] = React.useState(false);

  // Sign out and redirect to the specified redirect URI
  React.useEffect(() => {
    setProcessing(true);
    // Removed the signed in key
    localStorage.removeItem("SignedIn");
    const redirectUri = localStorage.getItem("redirectUri");
    userManager.signoutRedirectCallback().then((value) => {
      if (value.error) {
        setError(value.error);
        return;
      }
      // Redirect to the post logout URL
      if (redirectUri) {
        window.location.replace(redirectUri);
      }
      window.location.replace("/");
    });
    setProcessing(false);
  }, [userManager]);

  return (
    <Grid container alignItems="center" justifyContent="center" style={{ minHeight: "100vh" }}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper className={classes.paper} elevation={3}>
          <img src={logo} className="logo" alt="logo" />
          <Typography variant="h5">Sign out</Typography>
          <Typography>Hang on a moment while we sign you out.</Typography>
          <Status processing={processing} error={error} />
        </Paper>
      </Grid>
    </Grid>
  );
};
