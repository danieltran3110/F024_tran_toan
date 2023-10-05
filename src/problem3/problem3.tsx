// TODO: Toan Tran
// issues:
// 1. missing blockchain property in WalletBalance interface
// 2. FormattedWalletBalance should extends interface of WalletBalance
// 3. missing BoxProps interface
// 4. missing useStyle hook for adding custom classes
// 5. missing useWalletBalances hook import
// 6. missing usePrices hook import
// 7. missing WalletRow component import
// 8. optimize getPriority with case "zilliqua" and Neo should return 20 once
// 9. sortedBalances is sorting multiple times, should be calculated once and make the code more readable and maintain
// 10. formatted: balance.amount.toFixed() should be calculated in "rows" before render.No need to loop to add it
//
// solutions:
// 1. add blockchain property in WalletBalance interface
// 2. FormattedWalletBalance interface should extends interface of WalletBalance then add formatted property
// 3. add BoxProps interface with children property required and others property optional
// 4. import makeStyles and useStyle hook for adding custom classes
// 5. import useWalletBalances hook
// 6. import usePrices hook
// 7. import WalletRow component
// 8. in the function getPriority with case "zilliqua" and "Neo" remove the return 20 between them and keep only one return 20
// 9. update variable name from sortedBalances to computationBalances to be more readable
// - inside computationBalances filter balances with amount <= 0 and priority > -99
// - then get the balances have been filtered and sort them by priority
// 10. remove formattedBalances, and then create formattedAmount = balance.amount.toFixed() before render and pass it to WalletRow component

///////// refactor version ////////

import React, { useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import useWalletBalances from "hooks/useWalletBalances";
import usePrices from "hooks/usePrices";
import WalletRow from "./WalletRow";

const useStyle = makeStyles(theme => ({
  row: {
    padding: theme.spacing(2),
  },
}));

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps {
  children: React.ReactNode;
  boxPropsInterface: any;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();
  const classes = useStyle();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const computationBalances = useMemo(() => {
    const filteredBalances = balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      return balancePriority > -99 && balance.amount <= 0;
    });

    return filteredBalances.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return leftPriority - rightPriority;
    });
  }, [balances, prices]);

  const rows = computationBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      const formattedAmount = balance.amount.toFixed();
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={formattedAmount}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

///////// refactor version ////////

// template code //
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
// template code //
