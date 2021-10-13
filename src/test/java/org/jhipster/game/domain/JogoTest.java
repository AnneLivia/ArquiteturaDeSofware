package org.jhipster.game.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.jhipster.game.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class JogoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Jogo.class);
        Jogo jogo1 = new Jogo();
        jogo1.setId(1L);
        Jogo jogo2 = new Jogo();
        jogo2.setId(jogo1.getId());
        assertThat(jogo1).isEqualTo(jogo2);
        jogo2.setId(2L);
        assertThat(jogo1).isNotEqualTo(jogo2);
        jogo1.setId(null);
        assertThat(jogo1).isNotEqualTo(jogo2);
    }
}
