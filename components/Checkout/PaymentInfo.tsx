import React from "react";

import { Button, createStyles, InputAdornment, Link, Paper, TextField, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import amex from "../../images/networks/amex.png";
import visa from "../../images/networks/visa.png";
import mastercard from "../../images/networks/mastercard.png";
import discover from "../../images/networks/discover.png";

interface Props {
  userInfoOpen: boolean;
  billingInfoOpen: boolean;
  shippingInfoOpen: boolean;
  paymentInfoOpen: boolean;
  setPaymentInfoOpen: (paymentInfoOpen: boolean) => void;
  paymentInfoSaved: boolean;
  setPaymentInfoSaved: (paymentInfoSaved: boolean) => void;
  cardType: string;
  setCardType: (cardType: string) => void;
  cardNumber: string;
  setCardNumber: (cardNumber: string) => void;
  cardName: string;
  setCardName: (cardName: string) => void;
  cardExpiration: string;
  setCardExpiration: (cardExpiration: string) => void;
  cardSecurityCode: string;
  setCardSecurityCode: (cardSecurityCode: string) => void;
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

export const PaymentInfo: React.FC<Props> = ({
  userInfoOpen,
  billingInfoOpen,
  shippingInfoOpen,
  paymentInfoOpen,
  setPaymentInfoOpen,
  paymentInfoSaved,
  setPaymentInfoSaved,
  cardType,
  setCardType,
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiration,
  setCardExpiration,
  cardSecurityCode,
  setCardSecurityCode,
}) => {
  const classes = useStyles();

  const [cardImage, setCardImage] = React.useState("");

  if (paymentInfoOpen) {
    return (
      <React.Fragment>
        <Typography variant="h6">Payment</Typography>
        <Typography variant="subtitle1">All payments are secure and encrypted</Typography>
        <form
          className={classes.root}
          onSubmit={(e) => {
            e.preventDefault();
            setPaymentInfoSaved(true);
            setPaymentInfoOpen(false);
          }}
        >
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => {
                const number = e.target.value.replaceAll(/[^0-9]+/g, "");
                if (number.startsWith("34") || number.startsWith("37")) {
                  setCardType("amex");
                  setCardImage(amex);
                  // Use 4-6-5 format
                  const sub1 = `${number.substring(0, 1)}${number.substring(1, 2)}${number.substring(
                    2,
                    3
                  )}${number.substring(3, 4)}`;
                  const sub2 = `${number.substring(4, 5)}${number.substring(5, 6)}${number.substring(
                    6,
                    7
                  )}${number.substring(7, 8)}${number.substring(8, 9)}${number.substring(9, 10)}`;
                  const sub3 = `${number.substring(10, 11)}${number.substring(11, 12)}${number.substring(
                    12,
                    13
                  )}${number.substring(13, 14)}${number.substring(14, 15)}`;
                  if (sub3) {
                    setCardNumber(`${sub1} ${sub2} ${sub3}`);
                  } else if (sub2) {
                    setCardNumber(`${sub1} ${sub2}`);
                  } else {
                    setCardNumber(sub1);
                  }
                  return;
                } else if (number.startsWith("4")) {
                  setCardType("visa");
                  setCardImage(visa);
                } else if (number.startsWith("5")) {
                  setCardType("mastercard");
                  setCardImage(mastercard);
                } else if (number.startsWith("6")) {
                  setCardType("discover");
                  setCardImage(discover);
                } else {
                  // Unknown card type
                  setCardType("");
                  setCardNumber(number.substring(0, 16));
                  return;
                }
                // Use 4-4-4-4 format
                const sub1 = `${number.substring(0, 1)}${number.substring(1, 2)}${number.substring(
                  2,
                  3
                )}${number.substring(3, 4)}`;
                const sub2 = `${number.substring(4, 5)}${number.substring(5, 6)}${number.substring(
                  6,
                  7
                )}${number.substring(7, 8)}`;
                const sub3 = `${number.substring(8, 9)}${number.substring(9, 10)}${number.substring(
                  10,
                  11
                )}${number.substring(11, 12)}`;
                const sub4 = `${number.substring(12, 13)}${number.substring(13, 14)}${number.substring(
                  14,
                  15
                )}${number.substring(15, 16)}`;
                if (sub4) {
                  setCardNumber(`${sub1} ${sub2} ${sub3} ${sub4}`);
                } else if (sub3) {
                  setCardNumber(`${sub1} ${sub2} ${sub3}`);
                } else if (sub2) {
                  setCardNumber(`${sub1} ${sub2}`);
                } else {
                  setCardNumber(sub1);
                }
              }}
              label="Card number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {cardType && <img src={cardImage} height="30" alt="issuer" />}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              autoComplete="cc-name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              inputProps={{ maxLength: 255 }}
              label="Name on card"
            />
          </div>
          <div className={classes.flex}>
            <TextField
              fullWidth
              required
              inputMode="numeric"
              autoComplete="cc-exp"
              value={cardExpiration}
              onChange={(e) => {
                const expiration = e.target.value.replaceAll("/", "").replaceAll(/[^0-9]+/g, "");
                const sub1 = `${expiration.substring(0, 1)}${expiration.substring(1, 2)}`;
                const sub2 = `${expiration.substring(2, 3)}${expiration.substring(3, 4)}`;
                if (sub2) {
                  setCardExpiration(`${sub1} / ${sub2}`);
                } else {
                  setCardExpiration(sub1);
                }
              }}
              label="Expiration date (MM / YY)"
            />
            <TextField
              fullWidth
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cardSecurityCode}
              onChange={(e) => {
                const code = e.target.value.replaceAll(/[^0-9]+/g, "");
                setCardSecurityCode(code);
              }}
              inputProps={{ maxLength: cardType === "amex" ? 4 : 3 }}
              label={`Security code (${cardType === "amex" ? 4 : 3} digits)`}
            />
          </div>
          <div className={classes.flex}>
            <Link href="/" className={classes.flexGrow}>
              <Typography>{"< Return to store"}</Typography>
            </Link>
            <Button type="submit" size="large" variant="contained">
              Save payment information
            </Button>
          </div>
        </form>
      </React.Fragment>
    );
  } else if (paymentInfoSaved) {
    return (
      <Paper className={classes.paper} variant="outlined">
        <div className={classes.flex}>
          <Typography className={classes.flexGrow}>Payment</Typography>
          <Typography className={classes.flexGrow}>
            {`${cardType.toUpperCase()} ending in ${cardNumber.slice(-4)}`}
          </Typography>
          <Button
            disabled={userInfoOpen || billingInfoOpen || shippingInfoOpen}
            onClick={() => setPaymentInfoOpen(true)}
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
