export const nl = `
`;

function getProgress (n, red = false) {
  let m = '';
  let fill = red ? '🟥' : '🟩';
  for (let i = 0; i < 10; i++) {
    m += n >= i ? fill : '⬜️';
  }
  m += '';
  return m;
}

export function templateBorrowStat (stat, i) {
  if (stat) {
    let message = '';
    const totalBorrowed = stat.totalBorrowed.toFixed(0);
    const totalCollateral = stat.totalCollateral.toFixed(0);
    message += `========================${nl}`;
    message += `<b>WALLET #${i + 1}</b>${nl}`;
    message += `${nl}Umee${nl}`;
    message += `collateral: ${totalCollateral}${nl}`;
    message += `borrowed: ${totalBorrowed}${nl}`;
    message += getProgress(parseInt(stat.borrowLimitPercent / 10), stat.borrowLimitPercent > 82) + ' ' + stat.borrowLimitPercent.toFixed(0) + '%' + nl;

    message += `${nl}ETH${nl}`;
    message += `supply: ${stat.eth.supply}${nl}`;
    message += `borrowed: ${stat.eth.borrow}${nl}`;
    message += getProgress(parseInt(stat.eth.borrowPercent / 10), stat.eth.borrowPercent > 82) + ' ' + stat.eth.borrowPercent.toFixed(0) + '%' + nl;

    return message + nl;
  } else {
    return nl
  }
}
