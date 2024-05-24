# /*F.Hecht, G.Lance, E. Trélat
# Reusable template to solve optimization problem using IpOpt within FreeFEM
# Example taken from "PDE constrained optimization within FreeFEM"
# Example (3.1) in Section 3.2:
# Using IpOpt and Automatic differentiation via AMPL
# model file
# */

param mV integer >=0;
param mP integer >=0;

set indexV = 0..mV-1;
set indexP = 0..mP-1;
 
set indexPx dimen 2; # matrix of dx operator
set indexPy dimen 2; # matrix of dy operator
set indexM dimen 1; # mass matrix
set indexG dimen 1; # degrees of freedom indices for boundary constraint
set indexUE dimen 1; 

param Px{indexPx};
param Py{indexPy};
param M{indexM};
param ue{indexUE}; # boundary function

var u{indexV}; # degrees of freedom

minimize cost : sum{i in indexM}( M[i]*sqrt(1.0+ (sum{(i,j) in indexPx}( Px[i,j]*u[j] ))**2 + (sum{(i,j) in indexPy}( Py[i,j]*u[j] ))**2));

# constraint u=ue on the boundary
subject to gamma_inf{i in indexG} : u[i]<=ue[i] + 1.e-19;
subject to gamma_sup{i in indexG} : u[i]>=ue[i] - 1.e-19;

option solver ipopt;
option ipopt_options"max_iter=1000 tol=1.e-15 linear_solver=mumps";

