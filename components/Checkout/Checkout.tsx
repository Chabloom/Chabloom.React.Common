import React from "react";

import { AppBar, Button, Container, createStyles, Grid, Hidden, Theme, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { ProductsApi, ProductViewModel } from "../../types";

import { useAppContext } from "../../../AppContext";
import { ContactInfo } from "./ContactInfo";
import { BillingInfo } from "./BillingInfo";
import { ShippingInfo } from "./ShippingInfo";
import { PaymentInfo } from "./PaymentInfo";
import { Status } from "../Status";
import { ProductInfo } from "./ProductInfo";
import { PricingInfo } from "./PricingInfo";
import { OrdersApi, OrderViewModel } from "../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      position: "absolute",
      width: "100%",
    },
    infoForm: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(3),
      },
    },
    container: {
      margin: "0",
      padding: "0",
      [theme.breakpoints.up("sm")]: {
        height: "100vh",
      },
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
  const classes = useStyles();

  const { productCounts, setProductCounts, pickupMethod } = useAppContext();

  const [error, setError] = React.useState("");
  const [processing, setProcessing] = React.useState(false);
  //const [paymentCards, setPaymentCards] = React.useState<Array<PaymentCardViewModel>>([]);
  const [products, setProducts] = React.useState<Array<ProductViewModel>>([]);
  const [subTotal, setSubTotal] = React.useState(0);
  const [taxes, setTaxes] = React.useState(0);
  const [shipping, setShipping] = React.useState(0);

  // Contact info
  const [userInfoOpen, setUserInfoOpen] = React.useState(true);
  const [userInfoSaved, setUserInfoSaved] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // Billing info
  const [billingInfoOpen, setBillingInfoOpen] = React.useState(false);
  const [billingInfoSaved, setBillingInfoSaved] = React.useState(false);
  const [billingName1, setBillingName1] = React.useState("");
  const [billingName2, setBillingName2] = React.useState("");
  const [billingCompany, setBillingCompany] = React.useState("");
  const [billingAddress1, setBillingAddress1] = React.useState("");
  const [billingAddress2, setBillingAddress2] = React.useState("");
  const [billingCity, setBillingCity] = React.useState("");
  const [billingCountry, setBillingCountry] = React.useState("");
  const [billingState, setBillingState] = React.useState("");
  const [billingPostCode, setBillingPostCode] = React.useState("");
  const [billingAsShipping, setBillingAsShipping] = React.useState(false);

  // Shipping info
  const [shippingInfoOpen, setShippingInfoOpen] = React.useState(false);
  const [shippingInfoSaved, setShippingInfoSaved] = React.useState(false);
  const [shippingName1, setShippingName1] = React.useState("");
  const [shippingName2, setShippingName2] = React.useState("");
  const [shippingCompany, setShippingCompany] = React.useState("");
  const [shippingAddress1, setShippingAddress1] = React.useState("");
  const [shippingAddress2, setShippingAddress2] = React.useState("");
  const [shippingCity, setShippingCity] = React.useState("");
  const [shippingCountry, setShippingCountry] = React.useState("");
  const [shippingState, setShippingState] = React.useState("");
  const [shippingPostCode, setShippingPostCode] = React.useState("");

  // Payment info
  const [paymentInfoOpen, setPaymentInfoOpen] = React.useState(false);
  const [paymentInfoSaved, setPaymentInfoSaved] = React.useState(false);
  const [cardType, setCardType] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardExpiration, setCardExpiration] = React.useState("");
  const [cardSecurityCode, setCardSecurityCode] = React.useState("");

  // TODO: Allow payment card storage
  /*React.useEffect(() => {
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
  }, [userToken]);*/

  React.useEffect(() => {
    const getProducts = async () => {
      setProcessing(true);
      setProducts([]);
      if (productCounts && productCounts.size !== 0) {
        const api = new ProductsApi("");
        productCounts.forEach(async (productCount, productId) => {
          const [ret, err] = await api.readItem(productId);
          if (ret) {
            setProducts((prevState) => [...prevState, ret]);
          } else {
            setError(err);
          }
        });
      }
      setProcessing(false);
    };
    getProducts().then();
  }, [productCounts]);

  React.useEffect(() => {
    if (billingAsShipping) {
      setShippingInfoSaved(true);
      setShippingName1(billingName1);
      setShippingName2(billingName2);
      setShippingCompany(billingCompany);
      setShippingAddress1(billingAddress1);
      setShippingAddress2(billingAddress2);
      setShippingCity(billingCity);
      setShippingCountry(billingCountry);
      setShippingState(billingState);
      setShippingPostCode(billingPostCode);
    } else {
      setShippingInfoSaved(false);
      setShippingName1("");
      setShippingName2("");
      setShippingCompany("");
      setShippingAddress1("");
      setShippingAddress2("");
      setShippingCity("");
      setShippingCountry("");
      setShippingState("");
      setShippingPostCode("");
    }
  }, [billingInfoSaved]);

  React.useEffect(() => {
    let tempSubTotal = 0;
    products.forEach((product) => {
      tempSubTotal += product.price * (productCounts.get(product.id) as number);
    });
    setSubTotal(tempSubTotal);
    setTaxes(tempSubTotal * 0.07);
    setShipping(4.99);
  }, [products]);

  return (
    <React.Fragment>
      <header className={classes.header}>
        <AppBar color="default" position="fixed">
          <Toolbar>
            <img src="https://www.mlbstatic.com/team-logos/478.svg" height="50" />
          </Toolbar>
        </AppBar>
      </header>
      <Grid container className={classes.container}>
        <Grid item sm={7} xs={12}>
          <Toolbar />
          <Container>
            <div className={classes.infoForm}>
              <ContactInfo
                userInfoOpen={userInfoOpen}
                setUserInfoOpen={setUserInfoOpen}
                userInfoSaved={userInfoSaved}
                setUserInfoSaved={setUserInfoSaved}
                billingInfoOpen={billingInfoOpen}
                setBillingInfoOpen={setBillingInfoOpen}
                billingInfoSaved={billingInfoSaved}
                shippingInfoOpen={shippingInfoOpen}
                paymentInfoOpen={paymentInfoOpen}
                email={email}
                setEmail={setEmail}
              />
            </div>
            <div className={classes.infoForm}>
              <BillingInfo
                userInfoOpen={userInfoOpen}
                billingInfoOpen={billingInfoOpen}
                setBillingInfoOpen={setBillingInfoOpen}
                billingInfoSaved={billingInfoSaved}
                setBillingInfoSaved={setBillingInfoSaved}
                shippingInfoOpen={shippingInfoOpen}
                setShippingInfoOpen={setShippingInfoOpen}
                shippingInfoSaved={shippingInfoSaved}
                paymentInfoOpen={paymentInfoOpen}
                setPaymentInfoOpen={setPaymentInfoOpen}
                paymentInfoSaved={paymentInfoSaved}
                name1={billingName1}
                setName1={setBillingName1}
                name2={billingName2}
                setName2={setBillingName2}
                company={billingCompany}
                setCompany={setBillingCompany}
                address1={billingAddress1}
                setAddress1={setBillingAddress1}
                address2={billingAddress2}
                setAddress2={setBillingAddress2}
                city={billingCity}
                setCity={setBillingCity}
                country={billingCountry}
                setCountry={setBillingCountry}
                state={billingState}
                setState={setBillingState}
                postCode={billingPostCode}
                setPostCode={setBillingPostCode}
                billingAsShipping={billingAsShipping}
                setBillingAsShipping={setBillingAsShipping}
              />
            </div>
            <div className={classes.infoForm}>
              <ShippingInfo
                userInfoOpen={userInfoOpen}
                billingInfoOpen={billingInfoOpen}
                shippingInfoOpen={shippingInfoOpen}
                setShippingInfoOpen={setShippingInfoOpen}
                shippingInfoSaved={shippingInfoSaved}
                setShippingInfoSaved={setShippingInfoSaved}
                paymentInfoOpen={paymentInfoOpen}
                setPaymentInfoOpen={setPaymentInfoOpen}
                paymentInfoSaved={paymentInfoSaved}
                name1={shippingName1}
                setName1={setShippingName1}
                name2={shippingName2}
                setName2={setShippingName2}
                company={shippingCompany}
                setCompany={setShippingCompany}
                address1={shippingAddress1}
                setAddress1={setShippingAddress1}
                address2={shippingAddress2}
                setAddress2={setShippingAddress2}
                city={shippingCity}
                setCity={setShippingCity}
                country={shippingCountry}
                setCountry={setShippingCountry}
                state={shippingState}
                setState={setShippingState}
                postCode={shippingPostCode}
                setPostCode={setShippingPostCode}
              />
            </div>
            <div className={classes.infoForm}>
              <PaymentInfo
                userInfoOpen={userInfoOpen}
                billingInfoOpen={billingInfoOpen}
                shippingInfoOpen={shippingInfoOpen}
                paymentInfoOpen={paymentInfoOpen}
                setPaymentInfoOpen={setPaymentInfoOpen}
                paymentInfoSaved={paymentInfoSaved}
                setPaymentInfoSaved={setPaymentInfoSaved}
                cardType={cardType}
                setCardType={setCardType}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                cardExpiration={cardExpiration}
                setCardExpiration={setCardExpiration}
                cardSecurityCode={cardSecurityCode}
                setCardSecurityCode={setCardSecurityCode}
              />
            </div>
          </Container>
        </Grid>
        <Grid item sm={5} xs={12} style={{ backgroundColor: "#F1F1F1", borderLeft: "1px solid #CCCCCC" }}>
          <Hidden smDown>
            <Toolbar />
          </Hidden>
          <Container>
            <div className={classes.infoForm}>
              <ProductInfo products={products} formatter={formatter} />
              <Status processing={processing} error={error} />
            </div>
            <div className={classes.infoForm}>
              <PricingInfo
                subTotal={subTotal}
                taxes={taxes}
                shipping={shipping}
                hasShipping={shippingInfoSaved && pickupMethod === "Shipping"}
                formatter={formatter}
              />
            </div>
            <div className={classes.infoForm}>
              <div className={classes.flex}>
                <Button
                  disabled={userInfoOpen || billingInfoOpen || shippingInfoOpen || paymentInfoOpen}
                  size="large"
                  variant="contained"
                  style={{ marginLeft: "auto" }}
                  onClick={async () => {
                    const order = {
                      pickupMethod: pickupMethod,
                      transactionId: "00000000-0000-0000-0000-000000000000",
                      productCounts: {},
                    } as OrderViewModel;
                    productCounts.forEach((count, productId) => {
                      order.productCounts[productId] = count;
                    });
                    const api = new OrdersApi();
                    const [ret, err] = await api.addItem("", order);
                    if (ret) {
                      setProductCounts(new Map<string, number>());
                      window.location.replace(`/orderStatus?orderId=${ret.id}`);
                    } else {
                      setError(err);
                    }
                  }}
                >
                  Pay now
                </Button>
              </div>
            </div>
          </Container>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
