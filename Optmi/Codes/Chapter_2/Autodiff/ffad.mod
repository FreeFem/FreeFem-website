# F.Hecht, G.Lance, E. Trélat
# Reusable template to solve optimization problem using IpOpt within FreeFEM
# Example taken from "PDE constrained optimization within FreeFEM"
# Example (2.1,2.2,2.3) in Section 2.1.4:
# Solving template for LQ example using AMPL
# \min_{u} \int_{\Omega} (y-y_d)^2\,dx + \alpha \int_{\Omega} u^2 \,dx
# under the constraints
# -\Delta y = u, y_{\vert \partial \Omega} = 0, y(0)= 0
#
# Use of AMPL solver -> model file with unknowns, cost and constraint functions

param m integer >=0; # degrees of freedom
set index = 0..m;

set indexA dimen 2; # stiffness matrix
set indexM dimen 2; # mass matrix

param alpha = 1.0;
param A{indexA}; # stiffness matrix
param M{indexM}; # mass matrix
param L{index}; # volume constraint
param yd; # target

var Y{index}; # state
var U{index}; # control

minimize quad: sum{(i,j) in indexM}( 0.5*(Y[i]-yd)*M[i,j]*(Y[j]-yd) + 0.5*alpha*(U[i]*M[i,j]*U[j])); # cost function
 
subject to PDE{i in index}: sum{(i,j) in indexA}(A[i,j]*Y[j]) - sum{(i,j) in indexM}(M[i,j]*U[j]) = 0; # PDE constraint

# Bounds on control
subject to lowbound{i in index}: U[i] >= 0; 
subject to upbound{i in index}: U[i] <=1;

subject to volume: sum{i in index} U[i]*L[i] == 0.25; # ∫