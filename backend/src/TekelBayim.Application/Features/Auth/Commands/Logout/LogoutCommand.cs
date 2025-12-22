using MediatR;
using TekelBayim.Application.Common.Interfaces;

namespace TekelBayim.Application.Features.Auth.Commands.Logout;

/// <summary>
/// Kullanıcı çıkış komutu
/// </summary>
public record LogoutCommand : IRequest<bool>;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IAuthService _authService;

    public LogoutCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await _authService.LogoutAsync();
        return true;
    }
}
