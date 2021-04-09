import React from "react";

import {
  Badge,
  Button,
  Container,
  createStyles,
  Grid,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import amex from "../../images/networks/amex.png";
import discover from "../../images/networks/discover.png";
import mastercard from "../../images/networks/mastercard.png";
import visa from "../../images/networks/visa.png";

import { PaymentCardsApi, PaymentCardViewModel } from "../../types";
import { ProductsApi, ProductViewModel } from "../../../types";

import { useAppContext } from "../../../AppContext";

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
    header: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      padding: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    infoForm: {
      marginBottom: theme.spacing(1),
    },
    checkoutItem: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  })
);

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export const Checkout: React.FC = () => {
  const { userToken, order } = useAppContext();
  const classes = useStyles();

  const [error, setError] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  const [paymentCards, setPaymentCards] = React.useState<Array<PaymentCardViewModel>>([]);
  const [products, setProducts] = React.useState<Array<ProductViewModel>>([]);
  const [subTotal, setSubTotal] = React.useState(0);
  const [taxes, setTaxes] = React.useState(0);

  const [userInfoOpen, setUserInfoOpen] = React.useState(true);
  const [email, setEmail] = React.useState("");

  const [billingAddressOpen, setBillingAddressOpen] = React.useState(false);
  const [name1, setName1] = React.useState("");
  const [name2, setName2] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [address2, setAddress2] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [state, setState] = React.useState("");
  const [postCode, setPostCode] = React.useState("");

  const [paymentInfoOpen, setPaymentInfoOpen] = React.useState(false);
  const [cardType, setCardType] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardExpiration, setCardExpiration] = React.useState("");
  const [cardSecurityCode, setCardSecurityCode] = React.useState("");

  React.useEffect(() => {
    const getPaymentCards = async () => {
      if (userToken) {
        setProcessing(true);
        const api = new PaymentCardsApi();
        const [ret, err] = await api.readItems(userToken);
        if (ret) {
          setPaymentCards(ret);
        } else {
          setError(err);
        }
        setProcessing(false);
      }
    };
    getPaymentCards().then();
  }, [userToken]);

  React.useEffect(() => {
    const getProducts = async () => {
      if (userToken) {
        setProcessing(true);
        setProducts([]);
        const api = new ProductsApi("");
        order.productCounts.forEach(async (productCount, productId) => {
          const [ret, err] = await api.readItem(userToken, productId);
          if (ret) {
            setProducts((prevState) => [...prevState, ret]);
          } else {
            setError(err);
          }
        });
        setProcessing(false);
      }
    };
    getProducts().then();
  }, [userToken]);

  React.useEffect(() => {
    let tempSubTotal = 0;
    products.forEach((product) => {
      tempSubTotal += product.price * (order.productCounts.get(product.id) as number);
    });
    setSubTotal(tempSubTotal);
    setTaxes(tempSubTotal * 0.07);
  }, [products]);

  return (
    <React.Fragment>
      <header className={classes.header}>
        <img src="images/demo/logo-alternate.svg" height="150" />
      </header>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            {userInfoOpen && (
              <div className={classes.infoForm}>
                <Typography variant="h6">Contact information</Typography>
                <Paper className={classes.paper} variant="outlined">
                  <form
                    className={classes.root}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setUserInfoOpen(false);
                      if (!name1) {
                        setBillingAddressOpen(true);
                      }
                    }}
                  >
                    <div className={classes.flex}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email address"
                      />
                    </div>
                    <div className={classes.flex}>
                      <Link href="/cart" className={classes.flexGrow}>
                        <Typography>{"< Return to cart"}</Typography>
                      </Link>
                      <Button size="large" variant="contained">
                        Save contact information
                      </Button>
                    </div>
                  </form>
                </Paper>
              </div>
            )}
            {!userInfoOpen && email && (
              <div className={classes.infoForm}>
                <Paper className={classes.paper} variant="outlined">
                  <div className={classes.flex}>
                    <Typography className={classes.flexGrow}>Contact</Typography>
                    <Typography className={classes.flexGrow}>{email}</Typography>
                    <Button
                      disabled={billingAddressOpen || paymentInfoOpen}
                      onClick={() => {
                        setUserInfoOpen(true);
                        setBillingAddressOpen(false);
                        setPaymentInfoOpen(false);
                      }}
                      variant="text"
                    >
                      Change
                    </Button>
                  </div>
                </Paper>
              </div>
            )}
            {billingAddressOpen && (
              <div className={classes.infoForm}>
                <Typography variant="h6">Billing address</Typography>
                <Paper className={classes.paper} variant="outlined">
                  <form
                    className={classes.root}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setBillingAddressOpen(false);
                      if (!cardType) {
                        setPaymentInfoOpen(true);
                      }
                    }}
                  >
                    <div className={classes.flex}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="given-name"
                        value={name1}
                        onChange={(e) => setName1(e.target.value)}
                        label="First name"
                      />
                      <TextField
                        fullWidth
                        required
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
                        autoComplete="address-line1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        label="Address"
                      />
                    </div>
                    <div className={classes.flex}>
                      <TextField
                        fullWidth
                        autoComplete="address-line2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        label="Apartment, suite, etc. (optional)"
                      />
                    </div>
                    <div className={classes.flex}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        label="City"
                      />
                    </div>
                    <div className={classes.flex}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        label="Country/Region"
                      />
                      <TextField
                        fullWidth
                        required
                        autoComplete="address-level1"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        label="State"
                      />
                      <TextField
                        fullWidth
                        required
                        autoComplete="postal-code"
                        value={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                        label="Postal code"
                      />
                    </div>
                    <div className={classes.flex}>
                      <Link href="/cart" className={classes.flexGrow}>
                        <Typography>{"< Return to cart"}</Typography>
                      </Link>
                      <Button size="large" variant="contained">
                        Save billing address
                      </Button>
                    </div>
                  </form>
                </Paper>
              </div>
            )}
            {!billingAddressOpen && name1 && (
              <div className={classes.infoForm}>
                <Paper className={classes.paper} variant="outlined">
                  <div className={classes.flex}>
                    <Typography className={classes.flexGrow}>Billing</Typography>
                    <Typography className={classes.flexGrow}>{`${address1} ${city}, ${state} ${country}`}</Typography>
                    <Button
                      disabled={userInfoOpen || paymentInfoOpen}
                      onClick={() => {
                        setBillingAddressOpen(true);
                        setPaymentInfoOpen(false);
                      }}
                      variant="text"
                    >
                      Change
                    </Button>
                  </div>
                </Paper>
              </div>
            )}
            {paymentInfoOpen && (
              <div className={classes.infoForm}>
                <Typography variant="h6">Payment</Typography>
                <Typography variant="subtitle1">All payments are secure and encrypted</Typography>
                <Paper className={classes.paper} variant="outlined">
                  <form
                    className={classes.root}
                    onSubmit={(e) => {
                      e.preventDefault();
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
                          } else if (number.startsWith("5")) {
                            setCardType("mastercard");
                          } else if (number.startsWith("6")) {
                            setCardType("discover");
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
                              {cardType && (
                                <img src={cardType} height="30" alt="issuer" />
                              )}
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
                      <Link href="/cart" className={classes.flexGrow}>
                        <Typography>{"< Return to cart"}</Typography>
                      </Link>
                      <Button size="large" variant="contained">
                        Save payment information
                      </Button>
                    </div>
                  </form>
                </Paper>
              </div>
            )}
            {!paymentInfoOpen && cardType && (
              <div className={classes.infoForm}>
                <Paper className={classes.paper} variant="outlined">
                  <div className={classes.flex}>
                    <Typography className={classes.flexGrow}>Payment</Typography>
                    <Typography className={classes.flexGrow}>{`${cardType} ending ${cardNumber.slice(
                      -4
                    )} expires ${cardExpiration}`}</Typography>
                    <Button
                      disabled={userInfoOpen || billingAddressOpen}
                      onClick={() => {
                        setBillingAddressOpen(false);
                        setPaymentInfoOpen(true);
                      }}
                      variant="text"
                    >
                      Change
                    </Button>
                  </div>
                </Paper>
              </div>
            )}
          </Grid>
          <Grid item xs={5}>
            <div className={classes.infoForm}>
              <Paper className={classes.paper} variant="outlined">
                {products.map((product) => {
                  const count = order.productCounts.get(product.id) as number;
                  const price = formatter.format(product.price * count);
                  return (
                    <div key={`product-${product.id}`} className={classes.checkoutItem}>
                      <Badge color="secondary" badgeContent={count} style={{ marginRight: 20 }}>
                        <img src={`images/demo/${product.id.toUpperCase()}.webp`} style={{ maxHeight: 40 }} />
                      </Badge>
                      <Typography className={classes.flexGrow}>{product.name}</Typography>
                      <Typography style={{ margin: "auto" }}>{price}</Typography>
                    </div>
                  );
                })}
              </Paper>
            </div>
            <div className={classes.infoForm}>
              <Paper className={classes.paper} variant="outlined">
                <div className={classes.flex}>
                  <Typography className={classes.flexGrow}>Subtotal</Typography>
                  <Typography>{formatter.format(subTotal)}</Typography>
                </div>
                <div className={classes.flex}>
                  <Typography className={classes.flexGrow}>Taxes (estimated)</Typography>
                  <Typography>{formatter.format(taxes)}</Typography>
                </div>
              </Paper>
            </div>
            <div className={classes.infoForm}>
              <Paper className={classes.paper} variant="outlined">
                <div className={classes.flex}>
                  <Typography variant="h6" className={classes.flexGrow}>
                    Total
                  </Typography>
                  <Typography variant="h6">{formatter.format(subTotal + taxes)}</Typography>
                </div>
              </Paper>
            </div>
            <div>
              <div className={classes.flex}>
                <Button
                  disabled={userInfoOpen || billingAddressOpen || paymentInfoOpen}
                  size="large"
                  variant="contained"
                  style={{ marginLeft: "auto" }}
                >
                  Pay now
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};
