using MediatR;
using TekelBayim.Application.Common.Interfaces;
using TekelBayim.Application.DTOs;

namespace TekelBayim.Application.Features.Auth.Commands.Login;

/// <summary>
/// Kullanıcı giriş komutu
/// </summary>
public record LoginCommand(LoginRequest Request) : IRequest<AuthResult>;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResult>
{
    private readonly IAuthService _authService;

    public LoginCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        return await _authService.LoginAsync(request.Request);
    }
}
