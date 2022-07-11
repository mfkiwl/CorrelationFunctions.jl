function gencenters(side, λ)
    n = (λ * side^3) |> Poisson |> rand
    return reduce(hcat, (rand(1:side, 3) for i in 1:n))
end

function genballs(side, R, λ)
    sphere_side = 2R + 1
    padded_side = side + sphere_side
    spheres = zeros(Int8, (padded_side, padded_side, padded_side))
    sphere = zeros(Int8, (sphere_side, sphere_side, sphere_side))
    centers = gencenters(side, λ)
    for i in -R:R
        for j in -R:R
            for k in -R:R
                dist = i^2 + j^2 + k^2
                if dist < R^2
                    sphere[k+R+1, j+R+1, i+R+1] = 1
                end
            end
        end
    end

    for center in (centers[:,i] for i in 1:size(centers,2))
        x = center[1]
        y = center[2]
        z = center[3]
        spheres[x:x + 2R, y:y + 2R, z:z + 2R] .|= sphere
    end
    return spheres[R+1:end-R-1, R+1:end-R-1, R+1:end-R-1]
end

ss_theory(r, R) = (r < 2R) ? 2π*R^2/r : 0
sv_theory(r, R) = (r < 2R) ? (π*R*r + 2π*R^2) : 4π*R^2
s2_theory(r, R) = (r < 2R) ? 4/3*π*(r^3/16 - 3/4*R^2*r+R^3) : 0

function l2_theory(r, R, λ)
    η = λ * 4/3 * π * R^3
    p = exp(-η)
    return p^(1 + 3r/(4R))
end

function pore_size_theory(r, R, λ)
    s(x) = 4π * x^2
    v(x) = 4/3 * π * x^3
    η  = v(R) * λ
    p  = exp(-η)
    s1 = s(r + R)
    v1 = v(r + R)
    return λ * s1 * exp(-λ * v1) / p
end

@testset "S2 for ball" begin
    S = 300; R = 30

    th(r)  = s2_theory(r, R)
    disk   = draw_ball((S, S, S), R)
    calc   = Directional.s2(disk, true; periodic = true) |> mean
    theory = th.(0:length(calc)-1) / S^3

    @test relerr_norm(calc, theory) < 0.01
end

@testset "SS for a ball" begin
    R = 30.2; S = 300
    boundary = 2R |> floor |> Int

    disk   = draw_ball((S, S, S), R)
    th(r)  = ss_theory(r, R)
    calc   = Directional.surfsurf(disk, false; periodic = true) |> mean
    theory = th.(0:boundary) / S^3

    # FIXME: There values are almost zero, hence the high percentage.
    @test relerr_norm(calc[2:length(theory)-1], theory[2:end-1]) < 0.2
    @test maximum(calc[boundary+5:end]) < 1e-5
end

@testset "SV for a ball" begin
    S = 300; R = 30

    th(r)  = sv_theory(r, R)
    disk   = draw_ball((S, S, S), R)
    calc   = Directional.surfvoid(disk, false; periodic = true) |> mean
    theory = th.(0:length(calc)-1) / S^3

    @test relerr_norm(calc, theory) < 0.03
end

@testset "L2 on random overlapping balls generated by Poisson process" begin
    # Volume = S^3, radius of a ball = R
    # Poisson parameter = λ
    # Compare l2(x) for x ∈ {0,1,...,N-1}
    S = 500; R = 20; λ = 3e-5; N = 100
    balls = genballs(S, R, λ)

    calc = Directional.l2(balls, 0; len = N, periodic = true) |> mean .|> log
    theory = [log(l2_theory(r - 1, R, λ)) for r in 0:N - 1]
    err = relerr.(calc, theory)

    @test maximum(err) < 0.25
end

@testset "Pore size on random overlapping balls generated by Poisson process" begin
    # Volume = S^3, radius of a ball = R
    # Poisson parameter = λ
    S = 500; R = 30; λ = 1e-5
    balls = genballs(S, R, λ)

    calc = pore_size(balls; nbins = 20)
    edges = calc.edges[1]
    s = step(edges)
    theory = [integrate(x -> pore_size_theory(x, R, λ), n:0.05:n+s)
              for n in 0:s:s*(length(edges) - 2)]

    # Compare cummulative distributions instead of probability
    # densities because density is almost zero for big radii.
    calc_cdf = scan(calc.weights)
    theory_cdf = scan(theory)

    err = relerr.(calc_cdf, theory_cdf)
    @test maximum(err) < 0.25
end

@testset "Chord length for a ball" begin
    S = 300; R = 100

    disk = draw_ball((S, S, S), R)
    data = Directional.chord_length(disk, true)
    μ    = π^2/8 * R
    σ    = sqrt((1024 - 9π^4)/576) * R

    @test relerr(data.μ, μ) < 0.09
    @test relerr(data.σ, σ) < 0.09
end