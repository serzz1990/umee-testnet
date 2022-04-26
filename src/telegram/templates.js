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
    message += `<b>Wallet #${i + 1}</b>${nl}COLLATERAL / BORROWED${nl}${totalCollateral} / ${totalBorrowed}${nl}`;
    message += getProgress(parseInt(stat.borrowLimitPercent / 10), stat.borrowLimitPercent > 82) + ' ' + stat.borrowLimitPercent.toFixed(0) + '%' + nl;
    return message + nl;
  } else {
    return nl
  }
}
