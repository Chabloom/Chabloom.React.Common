import React from "react";

import { createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

interface Props {
  subTotal: number;
  taxes: number;
  formatter: Intl.NumberFormat;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: "flex",
    },
    flexGrow: {
      flexGrow: 1,
      margin: "auto",
    },
    infoDisplay: {
      borderTop: "1px solid #CCCCCC",
    },
    infoSubDisplay: {
      [theme.breakpoints.down("sm")]: {
        marginTop: theme.spacing(1),
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(2),
      },
    },
  })
);

export const PricingInfo: React.FC<Props> = ({ subTotal, taxes, formatter }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <div className={classes.infoDisplay}>
        <div className={classes.infoSubDisplay}>
          <div className={classes.flex}>
            <Typography className={classes.flexGrow}>Subtotal</Typography>
            <Typography>{formatter.format(subTotal)}</Typography>
          </div>
          <div className={classes.flex}>
            <Typography className={classes.flexGrow}>Taxes (estimated)</Typography>
            <Typography>{formatter.format(taxes)}</Typography>
          </div>
        </div>
      </div>
      <div className={classes.infoSubDisplay} />
      <div className={classes.infoDisplay}>
        <div className={classes.infoSubDisplay}>
          <div className={classes.flex}>
            <Typography variant="h6" className={classes.flexGrow}>
              Total
            </Typography>
            <Typography variant="h6">{formatter.format(subTotal + taxes)}</Typography>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
