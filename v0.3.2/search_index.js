var documenterSearchIndex = {"docs":
[{"location":"maps.html#Correlation-Maps","page":"Correlation Maps","title":"Correlation Maps","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"This is a documentation for CorrelationFunctions.Map module.","category":"page"},{"location":"maps.html#Functions","page":"Correlation Maps","title":"Functions","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"The following correlation functions are supported:","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"Lineal-path L_2 function.\nTwo point S_2 function.\nCluster C_2 function.\nSurface-surface F_ss function.\nSurface-void F_sv function.","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"Map.l2\nMap.s2\nMap.c2\nMap.surfsurf\nMap.surfvoid","category":"page"},{"location":"maps.html#Input-Interface","page":"Correlation Maps","title":"Input Interface","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"All functions share a common input interface.","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"Map.l2(img; periodic=false)","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"where img is an AbstractArray containing ones and zeros and periodic indicates boundary conditions. Unlike the Directional module Map module does not yet support multi-phase images or indicator functions. And it is up to end-user to provide a suitable single phase image.","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"using CorrelationFunctions\n\nmulti_phase_img = rand([0, 1, 2, 3], 10, 10)\n\nphase = 2\nimg = multi_phase_img .== phase\n\ncfmap = Map.s2(img)","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"When img is a CuArray then the functions will use GPU if possible.","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"using CorrelationFunctions\nusing CUDA\n\nimg = CUDA.rand([0, 1], 10, 10)\ncfmap = Map.s2(img)","category":"page"},{"location":"maps.html#Output-Interface","page":"Correlation Maps","title":"Output Interface","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"All functions return a CFMap structure containing an array of results and some information on how to interpret this array.","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"struct CFMap{T,N}\n    result::T\n    cf_type::Symbol\n    img_size::Tuple{Vararg{Int,N}}\n    zero_index::Tuple{Vararg{Int,N}}\nend","category":"page"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"result – minimum size array to restore full map\ncf_type – type of symmetry\n:full – no symmetry\n:central_symmetry – CF(-mathbfr) = CF(mathbfr)\n:periodic_point_point – CF(mathbfr) = CF(barmathbfr), where barmathbfr = mod(mathbfr size(img))\nimg_size – size of input image\nzero_index – result[zero_index...] = CF(0)","category":"page"},{"location":"maps.html#Result-Processing","page":"Correlation Maps","title":"Result Processing","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"Map.dir_from_map(cfmap, dir)\nMap.mean_dir(cfmap)\nMap.restore_full_map(cfmap)","category":"page"},{"location":"maps.html#Example","page":"Correlation Maps","title":"Example","text":"","category":"section"},{"location":"maps.html","page":"Correlation Maps","title":"Correlation Maps","text":"","category":"page"},{"location":"utilities.html#Utilities","page":"Utilities","title":"Utilities","text":"","category":"section"},{"location":"utilities.html","page":"Utilities","title":"Utilities","text":"read_cuboid\nlowfreq_energy_ratio","category":"page"},{"location":"utilities.html#CorrelationFunctions.read_cuboid","page":"Utilities","title":"CorrelationFunctions.read_cuboid","text":"read_cuboid(cfgpath :: String)\n\nRead 3D array from a disk. The data on disk consists of two files: JSON configuration file (which is passed to this function) and a raw binary array data.\n\nScheme of the configuration file is as follows, where x, y and z are dimensions of the array:\n\n{\n    \"dimensions\": [x, y, z],\n    \"datapath\": \"file-with-data\"\n}\n\nThe file with binary data, whose name is specified in datapath field, is searched relatively to the directory with the JSON configuration file. Its size must be exactly x⋅y⋅z bytes, each byte containing an element of the resulting array.\n\n\n\n\n\n","category":"function"},{"location":"utilities.html#CorrelationFunctions.Directional.lowfreq_energy_ratio","page":"Utilities","title":"CorrelationFunctions.Directional.lowfreq_energy_ratio","text":"lowfreq_energy_ratio(array, fraction = 0.5)\n\nCalculate a ratio E_aE where E is a total energy of a signal array and E_a is the energy concentrated in frequencies 0 af2 where f is the sampling rate and a is set via parameter fraction. mean(array) is subtracted from the array before calculations.\n\nThis function can be helpful in estimating if array is suitable for calculating surface-surface or surface-void function. An empirical criterion is that if this function returns a value greater than 0.95, the array is good.\n\n\n\n\n\n","category":"function"},{"location":"index.html#CorrelationFunctions.jl","page":"CorrelationFunctions.jl","title":"CorrelationFunctions.jl","text":"","category":"section"},{"location":"index.html","page":"CorrelationFunctions.jl","title":"CorrelationFunctions.jl","text":"This package is a collection of correlation functions described in Salvatore Torquato's book \"Random Heterogeneous Materials\" ISBN 978-1-4757-6357-7. These functions can be calculated for one-, two- or three-dimensional multiphase systems using closed walls (CW) or periodic boundary conditions (PBC) along multiple directions.","category":"page"},{"location":"index.html","page":"CorrelationFunctions.jl","title":"CorrelationFunctions.jl","text":"Correlation functions can be calculated using two slightly different ways. The first way is to calculate them across several predefined directions (e.g. axial directions of an array). Another way is to build a correlation map, in other words to calculate a correlation function in all possible directions in a given array. The first way is implemented in CorrelationFunctions.Directional module and the second is implemented in CorrelationFunctions.Map module.","category":"page"},{"location":"index.html","page":"CorrelationFunctions.jl","title":"CorrelationFunctions.jl","text":"Here is a documentation for each of those modules and some helper functions.","category":"page"},{"location":"index.html","page":"CorrelationFunctions.jl","title":"CorrelationFunctions.jl","text":"Directional Functions. Correlation functions across predefined directions.\nCorrelation Maps. Correlation maps or correlation functions in all directions.\nUtilities. Utility functions.","category":"page"},{"location":"directional.html#Directional-Functions","page":"Directional Functions","title":"Directional Functions","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"This is a documentation for CorrelationFunctions.Directional module. The documentation is divided into the following topics:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Correlation Functions page contains the exhaustive list of correlation functions supported by this package.\nAccessing Data page describes how to access data returned by correlation functions.\nBoundary Conditions page describes boundary conditions when calculations cross the boundary of a system.\nDirections page describes directions along which the correlation functions are computed.\nIndicator Functions page describes how to construct customary indicator functions.\nResults page contains comparison of correlation functions from this package with some known theoretical results.","category":"page"},{"location":"directional.html#Correlation-Functions","page":"Directional Functions","title":"Correlation Functions","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"The following correlation functions are supported:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Lineal-path L_2 function.\nTwo point S_2 function.\nCluster C_2 function.\nSurface-surface F_ss function.\nSurface-void F_sv function.\nPore size P function.\nChord length p function.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Directional.l2\nDirectional.s2\nDirectional.c2\nDirectional.surfsurf\nDirectional.surfvoid\nDirectional.pore_size\nDirectional.chord_length","category":"page"},{"location":"directional.html#CorrelationFunctions.Directional.l2","page":"Directional Functions","title":"CorrelationFunctions.Directional.l2","text":"l2(array, phase; [len][, directions,] periodic = false)\n\nCalculate L₂ (lineal path) correlation function for one-, two- or three-dimensional multiphase system.\n\nL₂(x) equals to probability that all elements of a line segment with length x cut from the array belong to the same phase. This implementation calculates L₂(x) for all xes in the range from 1 to len which defaults to half of the minimal dimension of the array.\n\nExamples\n\njulia> l2([1,1,1,0,1,1], 1; len = 6)[:x]\n6-element Array{Float64,1}:\n 0.8333333333333334\n 0.6\n 0.25\n 0.0\n 0.0\n 0.0\n\nFor a list of possible dimensions, see also: direction1Dp, direction2Dp, direction3Dp.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.s2","page":"Directional Functions","title":"CorrelationFunctions.Directional.s2","text":"s2(array, phase[; len][, plans][, directions,] periodic = false)\ns2(array, SeparableIndicator(χ₁, χ₂)[; len][, plans][,directions,] periodic = false)\ns2(array, InseparableIndicator(χ)[; len][,directions,] periodic = false)\n\nCalculate S₂ (two point) correlation function for one-, two- or three-dimensional multiphase system.\n\nS₂(x) equals to probability that corner elements of a line segment with the length x cut from the array belong to the same phase. This implementation calculates S₂(x) for all xes in the range from 1 to len which defaults to half of the minimal dimenstion of the array.\n\nMore generally, you can provide indicator function χ instead of phase. In this case S₂ function calculates probability of χ(x, y) returing true where x and y are two corners of a line segment. Indicator functions must be wrapped in either SeparableIndicator or InseparableIndicator. Some computations for separable indicator functions are optimized.\n\nAn argument plans can be used to support precomputed FFT plans which can be helpful if you call s2 often with the array of the same size. Plans can be computed with S2FTPlans constructor.\n\nExamples\n\njulia> s2([1,1,1,0,1,1], 1; len = 6)[:x]\n6-element Array{Float64,1}:\n 0.8333333333333334\n 0.6\n 0.5\n 0.6666666666666666\n 1.0\n 1.0\n\nSee also: direction1Dp, direction2Dp, direction3Dp, SeparableIndicator, InseparableIndicator, S2FTPlans.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.c2","page":"Directional Functions","title":"CorrelationFunctions.Directional.c2","text":"c2(array, phase[; len,][directions,] periodic = false)\n\nCalculate C₂ (cluster) correlation function for one-, two- or three-dimensional multiphase system.\n\nC₂(x) equals to probability that corner elements of a line segment with the length x cut from the array belong to the same cluster of the specific phase. This implementation calculates C2 for all xes in the range from 1 to len which defaults to half of the minimal dimension of the array.\n\nExamples\n\njulia> c2([1,1,1,0,1,1], 1; len = 6)[:x]\n6-element Array{Float64,1}:\n 0.8333333333333334\n 0.6\n 0.25\n 0.0\n 0.0\n 0.0\n\nFor a list of possible dimensions, see also: direction1Dp, direction2Dp, direction3Dp.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.surfsurf","page":"Directional Functions","title":"CorrelationFunctions.Directional.surfsurf","text":"surfsurf(array, phase[; len][, directions][, plans,] periodic = false, edgemode = :Sobel)\nsurfsurf(array, χ[; len][, directions][, plans,] periodic = false, edgemode = :Sobel)\n\nCalculate surface-surface correlation function for one-, two- or three-dimensional multiphase system.\n\nSurface-surface CF equals to probability that corner elements of a line segment with the length x cut from the array belong to the boundary of a cluster with the phase phase. This implementation calculates surface-surface function for all xs in the range from 1 to len which defaults to half of the minimal dimension of the array.\n\nYou can chose how an edge between phases are selected by passing edgemode argument which can be either :Sobel or :distance_map. Usually, :Sobel gives much better results.\n\nYou can specify a custom indicator function χ(x) instead of phase.\n\nAn argument plans can be used to support precomputed FFT plans which can be helpful if you call surfsurf often with the array of the same size. Plans can be computed with S2FTPlans constructor.\n\nSee also: direction1Dp, direction2Dp, direction3Dp, S2FTPlans.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.surfvoid","page":"Directional Functions","title":"CorrelationFunctions.Directional.surfvoid","text":"surfvoid(array, phase[; len][, directions][, plans,] periodic = false, edgemode = :Sobel)\nsurfvoid(array, χ[; len][, directions][, plans,] periodic = false, edgemode = :Sobel)\n\nCalculate surface-void correlation function for one-, two- or three-dimensional multiphase system.\n\nSurface-void CF equals to probability that one corner of a line segment with the length x cut from the array belongs to the boundary of a cluster with the phase phase and the other belongs to the void phase 0. This implementation calculates surface-void function for all xs in the range from 1 to len which defaults to half of the minimal dimension of the array.\n\nYou can chose how an edge between phases are selected by passing edgemode argument which can be either :Sobel or :distance_map. Usually, :Sobel gives much better results.\n\nYou can specify a custom indicator function χ(x) instead of phase.\n\nAn argument plans can be used to support precomputed FFT plans which can be helpful if you call surfvoid often with the array of the same size. Plans can be computed with S2FTPlans constructor.\n\nSee also: direction1Dp, direction2Dp, direction3Dp, S2FTPlans.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.pore_size","page":"Directional Functions","title":"CorrelationFunctions.Directional.pore_size","text":"pore_size(array, phase = 0; nbins = 10, periodic = false)\n\nCalculate pore size correlation function for one-, two- or three-dimensional multiphase system.\n\nPore size correlation function P(x) equals to probability of inserting a ball with radius R ∈ [x, x + δx] into a system so that it lies entirely in the phase phase.\n\nThis implementation divides the range of possible radii into nbins subranges and returns a normalized histogram of radii. This is roughly equal to integrating P(x) for each subrange.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.chord_length","page":"Directional Functions","title":"CorrelationFunctions.Directional.chord_length","text":"chord_length(array, phase[; directions,] nbins = 10)\n\nCalculate chord length correlation function for one-, two- or three-dimensional multiphase system.\n\nCord length function p(x) equals to probability of finding a chord whose length is in the range [x, x+δx] and which lies entirely in the phase phase. A chord is a line segment which touches the boundary of a same-phase cluster with its ends.\n\nThis implementation bins chord lengths into nbins bins and returns normalized histogram on collected data and the mean chord length in a tuple.\n\nExamples\n\njulia> chord_length([1, 0, 0, 0, 0, 1], 0)\n(StatsBase.Histogram{Float64,1,Tuple{StepRangeLen{Float64,Base.TwicePrecision{Float64},Base.TwicePrecision{Float64}}}}\nedges:\n  4.0:1.0:5.0\nweights: [1.0]\nclosed: left\nisdensity: false, 4.0)\n\nFor a list of possible dimensions, see also: direction1Dp, direction2Dp, direction3Dp.\n\n\n\n\n\n","category":"function"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"The pore_size function is also reexported from CorrelationFunctions directly, not being actually a \"directional\" function.","category":"page"},{"location":"directional.html#Accessing-Data","page":"Directional Functions","title":"Accessing Data","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"The most functions in this package (with exception to pore_size and chord_length) return a value of type CorrelationData:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"using CorrelationFunctions.Directional\nusing Random\n\na = l2(rand(MersenneTwister(1453), 0:1, (100, 100, 100)), 1)","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"You can extract the values along any computed direction using indexing operator:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"using CorrelationFunctions.Directional\nusing Random\n\na = l2(rand(MersenneTwister(1453), 0:1, (100, 100, 100)), 1)\na[:y]","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Also you can average results along multiple directions using StatsBase.mean function:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"using CorrelationFunctions.Directional\nusing Random\nusing StatsBase\n\na = l2(rand(MersenneTwister(1453), 0:1, (100, 100, 100)), 1)\nmean(a, [:x, :y])","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Calling StatsBase.mean without the second argument averages along all computed directions.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Another useful function is Directional.direction:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Directional.directions","category":"page"},{"location":"directional.html#CorrelationFunctions.Directional.directions","page":"Directional Functions","title":"CorrelationFunctions.Directional.directions","text":"directions(data :: CorrelationData)\n\nReturn directions along which a correlation function is computed.\n\nExamples\n\njulia> directions(l2(rand(0:1, (50, 10)), 1))\n2-element Vector{Symbol}:\n :x\n :y\n\n\n\n\n\n","category":"function"},{"location":"directional.html#Boundary-Conditions","page":"Directional Functions","title":"Boundary Conditions","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"When calculating the value of correlation functions like S_2 or L_2 it may be necessary to cross a boundary of the input array. There two options how CorrelationFunctions.jl handles this situation:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Impose \"closed walls\" (CW) boundary conditions on the input data. This means that the boundary is not crossed and correlation functions gather less statistics for bigger length of test line segments.\nImpose periodic boundary conditions (PBC) on the input data. This means that the input is wrapped around itself (i.e. modular arithmetic is used to access the array).","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"PBC is used when you specify periodic = true when call a correlation function, otherwise CW is used.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Directional.S2FTPlans","category":"page"},{"location":"directional.html#CorrelationFunctions.Directional.S2FTPlans","page":"Directional Functions","title":"CorrelationFunctions.Directional.S2FTPlans","text":"S2FTPlans(array, Plane())\nS2FTPlans(array, Torus())\n\nCreate FFT plans for faster calculation of two-point, surface-surface and surface-void  correlation functions. Plane() corresponds to CW boundary conditions and Torus() corresponds to periodic boundary conditions.\n\nSee also: s2, surfsurf, surfvoid.\n\n\n\n\n\nS2FTPlans(array, periodic)\n\nCreate FFT plans for faster calculation of two-point, surface-surface and surface-void  correlation functions. Periodic boundary conditions are used when periodic is true, otherwise CW boundary conditions are used.\n\n\n\n\n\n","category":"type"},{"location":"directional.html#Directions","page":"Directional Functions","title":"Directions","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Correlation functions can be computed in many directions depending on how test line segments are aligned with the input array. The default directions are [:x] for 1D, [:x, :y] for 2D and [:x, :y, :z] for 3D arrays. Possible directions and their meaning are described in the documentation for directionNDp functions where N stands for 1, 2 and 3.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Directional.direction1Dp\nDirectional.direction2Dp\nDirectional.direction3Dp\nDirectional.default_directions","category":"page"},{"location":"directional.html#CorrelationFunctions.Directional.direction1Dp","page":"Directional Functions","title":"CorrelationFunctions.Directional.direction1Dp","text":"direction1Dp(sym)\n\nReturn true if sym is 1D direction or false otherwise.\n\nThe only possible 1D direction is :x.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.direction2Dp","page":"Directional Functions","title":"CorrelationFunctions.Directional.direction2Dp","text":"direction2Dp(sym)\n\nReturn true if sym is 2D direction or false otherwise.\n\nKnown directions are:\n\n:x and :y. Correlation functions are computed along unit vectors  (1, 0) and (0, 1) respectively.\n:xy and :yx. Correlation functions are computed in diagonal  directions (1, 1) and (-1, 1) respectively.\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.direction3Dp","page":"Directional Functions","title":"CorrelationFunctions.Directional.direction3Dp","text":"direction3Dp(sym)\n\nReturn true if sym is 3D direction or false otherwise.\n\nKnown directions are:\n\n:x, :y and :z. Correlation functions are computed along unit  vectors (1, 0, 0), (0, 1, 0) and (0, 0, 1) respectively.\n:xy, :xz and :yz. Correlation functions are computed in  diagonal directions (1, 1, 0), (1, 0, 1) and (0, 1, 1)  respectively.\n:yx, :zx and :zy. Correlation functions are computed in  diagonal directions (-1, 1, 0), (-1, 0, 1) and (0, -1, 1)  respectively.\nxyz, yxz, xzy and zyx. Corresponding directions are  (1, 1, 1), (-1, 1, 1), (1, -1, 1) and (1, 1, -1).\n\n\n\n\n\n","category":"function"},{"location":"directional.html#CorrelationFunctions.Directional.default_directions","page":"Directional Functions","title":"CorrelationFunctions.Directional.default_directions","text":"default_directions(array)\n\nGet default direction in which correlation functions are calculated for the given array.\n\n\n\n\n\n","category":"function"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"These rules can help you to memoize the correspondence between symbolic designations and vectors:","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Symbolic designations can contain characters x, y and z and be from one to three symbols long. Each character can occur only once (so xyz is a valid designation and xxy is not).\nWhen a character does not occur is a designation (e.g, xy) that coordinate remains constant in a slice (in the example above z = textconst).\nThe names of the axes have a \"natural order\" which is x, y, z. In a designation the first axis which breaks that order get the minus sign in the direction vector (e.g. xzy equals to (1, -1, 1) because y is in the third position, not in the second, zx equals to (-1, 0, 1) because x is in the second position, no in the first, etc.)","category":"page"},{"location":"directional.html#Indicator-Functions","page":"Directional Functions","title":"Indicator Functions","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Internally, the functions c2, surfsurf and surfvoid (see Correlation Functions) are reduced to s2 passing more generic indicator functions rather than simply a phase. This feature is also exposed to users. If you want to use a custom indicator function, you need to wrap it to either SeparableIndicator or InseparableIndicator structure, calling the corresponding constructor. Note that s2 performs much better on big arrays when using SeparableIndicator.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Directional.AbstractIndicator\nDirectional.SeparableIndicator\nDirectional.InseparableIndicator","category":"page"},{"location":"directional.html#CorrelationFunctions.Directional.AbstractIndicator","page":"Directional Functions","title":"CorrelationFunctions.Directional.AbstractIndicator","text":"Abstract type for indicator functions mathbbR^2n rightarrow left0 1right where n = 1 2 text or  3.\n\n\n\n\n\n","category":"type"},{"location":"directional.html#CorrelationFunctions.Directional.SeparableIndicator","page":"Directional Functions","title":"CorrelationFunctions.Directional.SeparableIndicator","text":"SeparableIndicator(χ₁, χ₂)\n\nType for separable indicator function, that is for such an indicator function which can be written as chi(xy) = chi_1(x)chi_2(y).\n\nχ1 and χ2 must be functions of one argument which return a value of Bool type.\n\nNB: This indicator function is not symmetric (i.e. chi(xy) ne chi(yx)). This behaviour is intentional. For example you can write such an indicator, so the corresponding correlation function is sensitive to the spatial orientation of a system.\n\n\"That one, too fat! This one, too tall! This one… too symmetrical!\"\n\n\n\n\n\n","category":"type"},{"location":"directional.html#CorrelationFunctions.Directional.InseparableIndicator","page":"Directional Functions","title":"CorrelationFunctions.Directional.InseparableIndicator","text":"InseparableIndicator(χ)\n\nType for inseparable indicator function, that is for such an indicator function which cannot be written as chi(xy) = max(Chi(x y) Chi(y x)), where Chi(x y) = chi_1(x)chi_2(y).\n\nχ must be a function of two arguments which returns a value of Bool type.\n\n\n\n\n\n","category":"type"},{"location":"directional.html#Results","page":"Directional Functions","title":"Results","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"CorrelationFunctions.jl is tested on overlapping disks and balls of constant radius R with centers generated by Poisson process with parameter lambda (see section 5.1 of Random Heterogeneous Materials). An example of a two-dimensional two-phase system generated in this way is on the picture (R = 25 and lambda = 5 cdot 10^-4):","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"(Image: disks)","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Plots of all correlation functions calculated by CorrelationFunctions.jl for overlapping disks along with their theoretical values are given below. There are also plots of relative errors calculated as","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"texterr(x) = mid fractextcalculation(x) -\ntexttheory(x)texttheory(x) mid","category":"page"},{"location":"directional.html#Two-dimensional-systems","page":"Directional Functions","title":"Two-dimensional systems","text":"","category":"section"},{"location":"directional.html#Methodology","page":"Directional Functions","title":"Methodology","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"All functions in this section with exception of pore size and chord length functions are calculated on 15 random datasets generated with parameters R = 25 and lambda = 5 cdot 10^-4. Each dataset is an image with dimensions 4000x4000 pixels. The final result is an average of results on those 15 datasets. When function fastly decreases to zero a plot of a natural logarithm of that function is provided.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Pore size and chord length functions are calculated on one 4000x4000 dataset with the same parameters as above. A theoretical value is computed by averaging a theoretical function across each bin of a histogram returned by pore_size or chord_length function. Because both pore size and cord length functions decrease to zero with increase of their arguments, the relative errors are calculated for the corresponding cummulative distribution functions.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"All functions are called with default optional arguments unless explicitly stated otherwise.","category":"page"},{"location":"directional.html#Two-point-S_2(x)-function","page":"Directional Functions","title":"Two point S_2(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"S2 Error\n(Image: s2) (Image: s2 error)","category":"page"},{"location":"directional.html#Lineal-path-L_2(x)-function","page":"Directional Functions","title":"Lineal path L_2(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"L2 Error\n(Image: l2) (Image: l2 error)","category":"page"},{"location":"directional.html#Surface-surface-F_{ss}(x)-function","page":"Directional Functions","title":"Surface-surface F_ss(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Surface-surface Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Surface-void-F_{sv}(x)-function","page":"Directional Functions","title":"Surface-void F_sv(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Surface-void Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Pore-size-P(x)-function","page":"Directional Functions","title":"Pore size P(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Pore size Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Chord-length-p(x)-function","page":"Directional Functions","title":"Chord length p(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Chord length function chord_length was called with parameter nbins = 30.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Chord length Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Three-dimensional-systems","page":"Directional Functions","title":"Three-dimensional systems","text":"","category":"section"},{"location":"directional.html#Methodology-2","page":"Directional Functions","title":"Methodology","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"The idea is the same as in two-dimensional case, but chosen parameters are slightly different. The functions are averaged over 5 500x500x500 datasets with ball radius R = 20 and Poisson process parameter lambda = 3 cdot 10^-5.","category":"page"},{"location":"directional.html#Two-point-S_2(x)-function-2","page":"Directional Functions","title":"Two point S_2(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"S2 Error\n(Image: s2) (Image: s2 error)","category":"page"},{"location":"directional.html#Lineal-path-L_2(x)-function-2","page":"Directional Functions","title":"Lineal path L_2(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"L2 Error\n(Image: l2) (Image: l2 error)","category":"page"},{"location":"directional.html#Surface-surface-F_{ss}(x)-function-2","page":"Directional Functions","title":"Surface-surface F_ss(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Surface-surface Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Surface-void-F_{sv}(x)-function-2","page":"Directional Functions","title":"Surface-void F_sv(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Surface-void Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Pore-size-P(x)-function-2","page":"Directional Functions","title":"Pore size P(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Pore size Error\n(Image: ss) (Image: ss error)","category":"page"},{"location":"directional.html#Chord-length-p(x)-function-2","page":"Directional Functions","title":"Chord length p(x) function","text":"","category":"section"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Chord length function chord_length was called with parameter nbins = 30.","category":"page"},{"location":"directional.html","page":"Directional Functions","title":"Directional Functions","text":"Chord length Error\n(Image: ss) (Image: ss error)","category":"page"}]
}