import React from "react";

import {
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAppContext } from "../../../AppContext";

interface Props {
  userInfoOpen: boolean;
  billingInfoOpen: boolean;
  setBillingInfoOpen: (billingInfoOpen: boolean) => void;
  billingInfoSaved: boolean;
  setBillingInfoSaved: (billingInfoSaved: boolean) => void;
  shippingInfoOpen: boolean;
  setShippingInfoOpen: (shippingInfoOpen: boolean) => void;
  shippingInfoSaved: boolean;
  paymentInfoOpen: boolean;
  setPaymentInfoOpen: (paymentInfoOpen: boolean) => void;
  paymentInfoSaved: boolean;
  name1: string;
  setName1: (name1: string) => void;
  name2: string;
  setName2: (name2: string) => void;
  company: string;
  setCompany: (company: string) => void;
  address1: string;
  setAddress1: (address1: string) => void;
  address2: string;
  setAddress2: (address2: string) => void;
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  state: string;
  setState: (state: string) => void;
  postCode: string;
  setPostCode: (postCode: string) => void;
  billingAsShipping: boolean;
  setBillingAsShipping: (billingAsShipping: boolean) => void;
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

export const BillingInfo: React.FC<Props> = ({
  userInfoOpen,
  billingInfoOpen,
  setBillingInfoOpen,
  billingInfoSaved,
  setBillingInfoSaved,
  shippingInfoOpen,
  setShippingInfoOpen,
  shippingInfoSaved,
  paymentInfoOpen,
  setPaymentInfoOpen,
  paymentInfoSaved,
  name1,
  setName1,
  name2,
  setName2,
  company,
  setCompany,
  address1,
  setAddress1,
  address2,
  setAddress2,
  city,
  setCity,
  country,
  setCountry,
  state,
  setState,
  postCode,
  setPostCode,
  billingAsShipping,
  setBillingAsShipping,
}) => {
  const classes = useStyles();

  const { pickupMethod } = useAppContext();

  if (billingInfoOpen) {
    return (
      <React.Fragment>
        <Typography variant="h6">Billing address</Typography>
        <form
          className={classes.root}
          onSubmit={(e) => {
            e.preventDefault();
            setBillingInfoSaved(true);
            setBillingInfoOpen(false);
            if (!shippingInfoSaved && (pickupMethod === "Shipping" || pickupMethod === "In-Store")) {
              setShippingInfoOpen(true);
            } else if (!paymentInfoSaved) {
              setPaymentInfoOpen(true);
            }
          }}
        >
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              name="fname"
              autoComplete="given-name"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              label="First name"
            />
            <TextField
              fullWidth
              required
              name="lname"
              autoComplete="family-name"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              label="Last name"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              label="Company (optional)"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              name="bill-address-line1"
              autoComplete="billing address-line1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              label="Address"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              name="bill-address-line2"
              autoComplete="billing address-line2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              label="Apartment, suite, etc. (optional)"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              name="bill-city"
              autoComplete="billing address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              label="City"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              name="bill-country"
              autoComplete="billing country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              label="Country/Region"
            />
            <TextField
              fullWidth
              required
              name="bill-region"
              autoComplete="billing address-level1"
              value={state}
              onChange={(e) => setState(e.target.value)}
              label="State"
            />
            <TextField
              fullWidth
              required
              name="bill-postal"
              autoComplete="billing postal-code"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              label="Postal code"
            />
          </div>
          {pickupMethod === "Shipping" && (
            <div className={classes.flex}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={billingAsShipping}
                    onChange={(e, checked) => setBillingAsShipping(checked)}
                    color="primary"
                  />
                }
                label="Use billing address for shipping"
              />
            </div>
          )}
          <div className={classes.flex}>
            <Link href="/" className={classes.flexGrow}>
              <Typography>{"< Return to store"}</Typography>
            </Link>
            <Button type="submit" size="large" variant="contained">
              Save billing address
            </Button>
          </div>
        </form>
      </React.Fragment>
    );
  } else if (billingInfoSaved) {
    return (
      <Paper className={classes.paper} variant="outlined">
        <div className={classes.flex}>
          <Typography className={classes.flexGrow}>Billing</Typography>
          <Typography className={classes.flexGrow}>{`${address1} ${city}, ${state} ${country}`}</Typography>
          <Button
            disabled={userInfoOpen || shippingInfoOpen || paymentInfoOpen}
            onClick={() => setBillingInfoOpen(true)}
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
