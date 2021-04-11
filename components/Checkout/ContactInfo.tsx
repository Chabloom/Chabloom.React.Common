import React from "react";

import { Button, createStyles, Link, Paper, TextField, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  userInfoOpen: boolean;
  setUserInfoOpen: (userInfoOpen: boolean) => void;
  userInfoSaved: boolean;
  setUserInfoSaved: (userInfoSaved: boolean) => void;
  billingInfoOpen: boolean;
  setBillingInfoOpen: (billingInfoOpen: boolean) => void;
  billingInfoSaved: boolean;
  shippingInfoOpen: boolean;
  paymentInfoOpen: boolean;
  email: string;
  setEmail: (email: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1),
    },
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
      },
    },
    flex: {
      display: "flex",
    },
    flexGrow: {
      flexGrow: 1,
      margin: "auto",
    },
  })
);

export const ContactInfo: React.FC<Props> = ({
  userInfoOpen,
  setUserInfoOpen,
  userInfoSaved,
  setUserInfoSaved,
  billingInfoOpen,
  setBillingInfoOpen,
  billingInfoSaved,
  shippingInfoOpen,
  paymentInfoOpen,
  email,
  setEmail,
}) => {
  const classes = useStyles();

  if (userInfoOpen) {
    return (
      <React.Fragment>
        <Typography variant="h6">Contact information</Typography>
        <form
          className={classes.root}
          onSubmit={(e) => {
            console.log("submit");
            e.preventDefault();
            setUserInfoSaved(true);
            setUserInfoOpen(false);
            if (!billingInfoSaved) {
              setBillingInfoOpen(true);
            }
          }}
        >
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email address"
            />
          </div>
          <div className={classes.flex}>
            <Link href="/" className={classes.flexGrow}>
              <Typography>{"< Return to store"}</Typography>
            </Link>
            <Button type="submit" size="large" variant="contained">
              Save contact information
            </Button>
          </div>
        </form>
      </React.Fragment>
    );
  } else if (userInfoSaved) {
    return (
      <Paper className={classes.paper} variant="outlined">
        <div className={classes.flex}>
          <Typography className={classes.flexGrow}>Contact</Typography>
          <Typography className={classes.flexGrow}>{email}</Typography>
          <Button
            disabled={billingInfoOpen || shippingInfoOpen || paymentInfoOpen}
            onClick={() => setUserInfoOpen(true)}
            variant="text"
          >
            Change
          </Button>
        </div>
      </Paper>
    );
  }
  return null;
};
